import { TestBed } from '@angular/core/testing';
import { DepartmentService } from './department.service';
import { DepartmentViewModel } from '../models/department-view-model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const baseUrl = 'https://test-api.example.com/';

  const mockDepartments: DepartmentViewModel[] = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'IT' },
  ];

  beforeEach(() => {
    // Create a spy object for HttpClient
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        DepartmentService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: 'BASE_URL', useValue: baseUrl },
      ],
    });

    service = TestBed.inject(DepartmentService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an Observable of PersonViewModel array', () => {
      httpClientSpy.get.and.returnValue(of(mockDepartments));

      service.getAll().subscribe({
        next: (departments) => {
          expect(departments).toEqual(mockDepartments);
          expect(departments.length).toBe(1);
        },
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        baseUrl + 'api/department'
      );
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', () => {
      const mockEmptyDepartments: DepartmentViewModel[] = [];
      httpClientSpy.get.and.returnValue(of(mockEmptyDepartments));

      service.getAll().subscribe({
        next: (people) => {
          expect(people).toEqual(mockEmptyDepartments);
          expect(people.length).toBe(0);
        },
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        baseUrl + 'api/department'
      );
    });
  });
});
