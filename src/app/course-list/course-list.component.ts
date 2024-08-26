import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTableModule,
    RouterModule
  ]
})

export class CourseListComponent implements OnInit {
  displayedColumns: string[] = ['university', 'city', 'country', 'courseName', 'startDate', 'endDate'];
  courses: Course[] = [];
  totalCourses = 0;
  pageSize = 10;
  pageIndex = 0;
  searchControl = new FormControl('');

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses('');
    // Listen to search input changes
    this.searchControl.valueChanges.pipe(
      debounceTime(300) // Wait for 300ms pause in events
    ).subscribe(searchTerm => {
      this.pageIndex = 0; // Reset to first page
      this.loadCourses(searchTerm  || ''); // Use an empty string if the value is null
    });
  }

  loadCourses(search: string = ''): void {
    this.courseService.getCourses(search, this.pageIndex + 1, this.pageSize).subscribe(response => {
      this.courses = response.courses;
      this.totalCourses = response.total;
    });
  }

  calculateCourseLength(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert time difference to days
    return diffDays;
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCourses(this.searchControl.value || ''); // Pass the current search term. Use an empty string if the value is null
  }

  addNewCourse(): void {
    // Logic to navigate to the course creation form
    this.router.navigate(['/courses/new']);
  }

  editCourse(id: string): void {
    // Find the course data by id
    const course = this.courses.find(course => course._id === id);
    // If the course is found, navigate to the edit page and pass the course data
    if (course) {
      this.router.navigate(['/courses/edit', id], { state: { course } });
    } else {
      console.error('Course not found!');
    }
  }

  deleteCourse(id: string): void {
    this.courseService.deleteCourse(id).subscribe(response => {
      this.loadCourses(this.searchControl.value || '');
    });
  }

}
