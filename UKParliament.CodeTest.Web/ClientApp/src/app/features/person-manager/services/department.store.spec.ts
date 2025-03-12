import { inject, TestBed } from '@angular/core/testing';
import { DepartmentStore } from './department.store';
import { DepartmentService } from './department.service';
import { provideHttpClient } from '@angular/common/http';

describe('DepartmentStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DepartmentStore,
        DepartmentService,
        provideHttpClient(),
        { provide: 'BASE_URL', useValue: 'http://localhost/' },
      ],
    });
  });

  it('should be created', inject(
    [DepartmentStore],
    (service: typeof DepartmentStore) => {
      expect(service).toBeTruthy();
    }
  ));
});

