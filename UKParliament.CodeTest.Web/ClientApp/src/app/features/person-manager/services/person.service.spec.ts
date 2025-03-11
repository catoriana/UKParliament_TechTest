import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { PersonService } from './person.service';
import { PersonViewModel } from '../models/person-view-model';
import { DepartmentViewModel } from '../models/department-view-model';

describe('PersonService', () => {
  let service: PersonService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const baseUrl = 'https://test-api.example.com/';

  // Test data
  const testDepartment: DepartmentViewModel = {
    id: 101,
    name: 'Engineering'
  };

  const testPerson: PersonViewModel = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    departmentId: 101,
    department: testDepartment
  };

  beforeEach(() => {
    // Create a spy object for HttpClient
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        PersonService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: 'BASE_URL', useValue: baseUrl }
      ]
    });
    
    service = TestBed.inject(PersonService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an Observable of PersonViewModel array', () => {
      const mockPeople: PersonViewModel[] = [testPerson];
      httpClientSpy.get.and.returnValue(of(mockPeople));
      
      service.getAll().subscribe({
        next: people => {
          expect(people).toEqual(mockPeople);
          expect(people.length).toBe(1);
        }
      });
      
      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl + 'api/person');
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', () => {
      const mockEmptyPeople: PersonViewModel[] = [];
      httpClientSpy.get.and.returnValue(of(mockEmptyPeople));
      
      service.getAll().subscribe({
        next: people => {
          expect(people).toEqual(mockEmptyPeople);
          expect(people.length).toBe(0);
        }
      });
      
      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl + 'api/person');
    });
  });

  describe('deletePerson', () => {
    it('should send DELETE request with correct ID', () => {
      const personId = 1;
      httpClientSpy.delete.and.returnValue(of(undefined));
      
      service.deletePerson(personId).subscribe({
        next: response => {
          expect(response).toBeUndefined();
        }
      });
      
      expect(httpClientSpy.delete).toHaveBeenCalledWith(baseUrl + 'api/person/1');
    });
  });

  describe('addPerson', () => {
    it('should send POST request with the person in model.body', () => {
      httpClientSpy.post.and.returnValue(of(testPerson));
      
      service.addPerson(testPerson).subscribe({
        next: person => {
          expect(person).toEqual(testPerson);
        }
      });
      
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        baseUrl + 'api/person/',
        { testPerson }
      );
    });

    it('should return the created person from the API', () => {
      // Server might add ID and other fields
      const returnedPerson: PersonViewModel = {
        ...testPerson,
        id: 99 // Server assigned ID
      };
      
      httpClientSpy.post.and.returnValue(of(returnedPerson));
      
      service.addPerson(testPerson).subscribe({
        next: person => {
          expect(person.id).toBe(99); // Check the server-assigned ID
          expect(person.firstName).toBe(testPerson.firstName);
          expect(person.lastName).toBe(testPerson.lastName);
        }
      });
      
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        baseUrl + 'api/person/',
        { model: { body: testPerson } }
      );
    });
  });

  describe('updatePerson', () => {
    it('should send PUT request with the person in model.body', () => {
      httpClientSpy.put.and.returnValue(of(testPerson));
      
      service.updatePerson(testPerson).subscribe({
        next: person => {
          expect(person).toEqual(testPerson);
        }
      });
      
      expect(httpClientSpy.put).toHaveBeenCalledWith(
        baseUrl + 'api/person/',
        { model: { body: testPerson } }
      );
    });

    it('should return the updated person from the API', () => {
      const updatedPerson: PersonViewModel = {
        ...testPerson,
        firstName: 'Updated',
        lastName: 'Person'
      };
      
      httpClientSpy.put.and.returnValue(of(updatedPerson));
      
      service.updatePerson(testPerson).subscribe({
        next: person => {
          expect(person.firstName).toBe('Updated');
          expect(person.lastName).toBe('Person');
        }
      });
      
      expect(httpClientSpy.put).toHaveBeenCalledWith(
        baseUrl + 'api/person/',
        {  testPerson  }
      );
    });
  });

});