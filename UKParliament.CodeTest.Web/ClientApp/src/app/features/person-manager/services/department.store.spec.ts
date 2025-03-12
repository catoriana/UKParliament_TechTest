import { inject, TestBed } from '@angular/core/testing';
import { DepartmentStore } from './department.store';
import { DepartmentService } from './department.service';

describe('DepartmentStore', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [DepartmentStore, DepartmentService],
      });
    });
  
    it('should be created', inject([DepartmentStore], (service: typeof DepartmentStore) => {
      expect(service).toBeTruthy();
    }));
  });