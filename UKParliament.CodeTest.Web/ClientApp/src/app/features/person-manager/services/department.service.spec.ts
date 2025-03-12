import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DepartmentService } from './department.service';
import { DepartmentViewModel } from '../models/department-view-model';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://api.example.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DepartmentService,
        { provide: 'BASE_URL', useValue: baseUrl }
      ]
    });

    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve all departments from the API', () => {
      // Arrange
      const mockDepartments: DepartmentViewModel[] = [
        { id: 1, name: 'IT' },
        { id: 2, name: 'HR' },
        { id: 3, name: 'Finance' }
      ];

      // Act
      let result: DepartmentViewModel[] | undefined;
      service.getAll().subscribe(departments => {
        result = departments;
      });

      // Assert
      const req = httpMock.expectOne(baseUrl + 'api/department');
      expect(req.request.method).toBe('GET');
      
      // Respond with mock data
      req.flush(mockDepartments);
      
      // Verify the result matches our mock data
      expect(result).toEqual(mockDepartments);
    });

    it('should handle errors when the API request fails', () => {
      // Act
      let error: any;
      service.getAll().subscribe({
        next: () => fail('Expected an error, not departments'),
        error: (e) => error = e
      });

      // Assert
      const req = httpMock.expectOne(baseUrl + 'api/department');
      expect(req.request.method).toBe('GET');
      
      // Respond with mock error
      req.flush('Error fetching departments', { 
        status: 500, 
        statusText: 'Server Error' 
      });
      
      // Verify the service propagates the error
      expect(error.status).toBe(500);
    });
  });
});