import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  public apiUrl = 'https://fastapi.wpgsoft.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getCourses(search: string = '', page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_courses`, { params: { search, page, pageSize } });
  }

  createCourse(course: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_course`, course);
  }

  updateCourse(id: string, course: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_course/${id}`, course);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_course/${id}`);
  }
}
