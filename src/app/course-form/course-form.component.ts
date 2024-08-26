import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  currencies: string[] = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
  isEditMode = false;
  courseId: string | null = null;

  // universityControl = this.fb.control('', Validators.required);
  // countryControl = this.fb.control('', Validators.required);
  // cityControl = this.fb.control('', Validators.required);

  filteredUniversities: Observable<string[]> = of([]);
  filteredCountries: Observable<string[]> = of([]);
  filteredCities: Observable<string[]> = of([]);

  allUniversities: string[] = ['Harvard University', 'Stanford University', 'MIT', 'University of Oxford', 'Universidad de Passo Fundo'];  // Replace with your data
  allCountries: string[] = ['United States', 'Canada', 'United Kingdom', 'Brazil', 'Australia'];  // Replace with your data
  allCities: string[] = ['New York', 'London', 'Toronto', 'São Paulo', 'Sydney'];  // Replace with your data
  private universityControl: FormControl<string | null>;
  private countryControl: FormControl<string | null>;
  private cityControl: FormControl<string | null>;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.universityControl = this.fb.control('', Validators.required);
    this.countryControl = this.fb.control('', Validators.required);
    this.cityControl = this.fb.control('', Validators.required);

    this.courseForm = this.fb.group({
      University: this.universityControl,
      City: this.cityControl,
      Country: this.countryControl,
      CourseName: ['', Validators.required],
      CourseDescription: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Price: ['', Validators.required],
      Currency: ['', Validators.required]
    });

    // Check if we're in edit mode by looking for state data
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['course']) {
      const course = navigation.extras.state['course'];
      this.courseForm.patchValue(course);  // Populate the form with course data
    }
  }

  ngOnInit(): void {

    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditMode = true;
      // Disable specific fields when in edit mode
      this.courseForm.controls['CourseName'].disable();
      this.courseForm.controls['University'].disable();
      this.courseForm.controls['Country'].disable();
      this.courseForm.controls['City'].disable();
    }

    this.filteredUniversities = this.universityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.allUniversities))
    );

    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.allCountries))
    );

    this.filteredCities = this.cityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.allCities))
    );
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      if (this.isEditMode) {
        this.courseService.updateCourse(this.courseId as string, this.courseForm.value).subscribe(() => {
          this.router.navigate(['/courses']);
        });
      } else {
        this.courseService.createCourse(this.courseForm.value).subscribe(() => {
          this.router.navigate(['/courses']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }

}
