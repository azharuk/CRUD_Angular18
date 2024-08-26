import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });

    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve courses from the API via GET', () => {
    const dummyCourses = [
      { _id: '1', name: 'Course 1', description: 'Description 1' },
      { _id: '2', name: 'Course 2', description: 'Description 2' },
    ];

    service.getCourses().subscribe(response => {
      console.log(response); // Add this line to debug the response
      expect(response.total).toBe(2);
      expect(response.courses.length).toBe(2);
      expect(response.courses).toEqual(dummyCourses);
    });


    const request = httpMock.expectOne(`${service.apiUrl}/get_courses?search=&page=1&pageSize=10`);
    expect(request.request.method).toBe('GET');
    request.flush({ total: 2, courses: dummyCourses });
  });

  it('should add a course via POST', () => {
    const newCourse = { _id: '3', name: 'Course 3', description: 'Description 3' };

    service.createCourse(newCourse).subscribe(course => {
      expect(course).toEqual(newCourse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/create_course`);
    expect(request.request.method).toBe('POST');
    request.flush(newCourse);
  });

  it('should update a course via PUT', () => {
    const updatedCourse = { _id: '1', name: 'Updated Course 1', description: 'Updated Description 1' };

    service.updateCourse('1', updatedCourse).subscribe(course => {
      expect(course).toEqual(updatedCourse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/update_course/1`);
    expect(request.request.method).toBe('PUT');
    request.flush(updatedCourse);
  });

  it('should delete a course via DELETE', () => {
    service.deleteCourse('1').subscribe(response => {
      expect(response.status).toBe('success');
    });

    const request = httpMock.expectOne(`${service.apiUrl}/delete_course/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status: 'success' });
  });
});
