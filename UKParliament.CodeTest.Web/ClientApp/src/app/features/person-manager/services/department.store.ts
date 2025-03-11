import { Injectable, signal, computed, inject } from '@angular/core';
import { DepartmentViewModel } from '../models/department-view-model';
import { Subject, takeUntil } from 'rxjs';
import { DepartmentService } from './department.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentStore {
  private departmentService = inject(DepartmentService);
  private _departments = signal<DepartmentViewModel[]>([]);
  private _isLoading = signal<boolean>(false); // For loading state
  private _errorMessage = signal<string | null>(null); // For error handling
  private destroy$ = new Subject<void>();
  departments = computed(() => this._departments());
  loadDepartments(): void {

    this._isLoading.set(true); // Set loading to true while fetching data

    this.departmentService
      .getAll()
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroyed
      .subscribe({
        next: (deps) => {
          this._departments.set(deps); // Update people list
          this._isLoading.set(false); // Set loading to false after data is loaded
        },
        error: (error) => {
          this._isLoading.set(false); // Set loading to false on error
          this._errorMessage.set(
            'Failed to load departments. Please try again later.'
          );
          console.error(error); // Log error
        },
      });
  }

  getDepartment(deparmentId: number): DepartmentViewModel | undefined {
    return this._departments().find(i => i.id == deparmentId);
  }

  // Unsubscribe when the store is no longer needed
  ngOnDestroy(): void {
    this.destroy$.next(); // Signal that the store is being destroyed
    this.destroy$.complete(); // Clean up the subject
  }
}
