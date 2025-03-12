import { inject, TestBed } from '@angular/core/testing';
import { PersonStore } from './person.store';
import { PersonService } from './person.service';
import { DepartmentStore } from './department.store';
import { provideHttpClient } from '@angular/common/http';

describe('PersonStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PersonStore, 
        DepartmentStore, 
        PersonService,
        provideHttpClient(),
        { provide: 'BASE_URL', useValue: 'http://localhost/' }
      ],
    });
  });

  it('should be created', inject([PersonStore], (service: typeof PersonStore) => {
    expect(service).toBeTruthy();
  }));
});
