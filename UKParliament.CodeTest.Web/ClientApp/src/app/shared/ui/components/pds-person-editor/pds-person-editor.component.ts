import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ageAndDateValidator } from '../../../../core/validators/age-and-date.validator';
import { DepartmentViewModel } from 'src/app/features/person-manager/models/department-view-model';
import { PersonViewModel } from 'src/app/features/person-manager/models/person-view-model';
import { REGEX } from 'src/app/core/constants/regex.constants';
import { FormErrorUtil } from 'src/app/core/utils/form-error-util';

@Component({
  selector: 'app-pds-person-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pds-person-editor.component.html',
  styleUrl: './pds-person-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdsPersonEditorComponent {
  private readonly fb = inject(FormBuilder);
  componentTitle = input<string>('');
  buttonReset = input<string>('');
  @Input() departments:  DepartmentViewModel[] | null = [];
  @Input() person: PersonViewModel | null = null;
  @Output() submitEvent = new EventEmitter<PersonViewModel>();
  @Output() cancelEvent = new EventEmitter<void>();
  newPerson: PersonViewModel = {
    id: 0,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    departmentId: 0,
  };
  // Form group to handle the reactive form
  form: FormGroup;
  
  constructor() {
    this.form = this.fb.nonNullable.group({
      firstName: ['', [Validators.required, Validators.pattern(REGEX.NAME),Validators.maxLength(100) ]],
      lastName: ['', [Validators.required, Validators.pattern(REGEX.NAME), Validators.maxLength(100)]],
      departmentId: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, ageAndDateValidator(18, 100)]],

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['person'] && this.person) {
      this.form.reset();
      this.form.patchValue({
        firstName: this.person.firstName,
        lastName: this.person.lastName,
        departmentId: this.person.departmentId,
        dateOfBirth: this.person.dateOfBirth,

      });
    }
  }

  getErrorMessage(controlName: string, controlFriendlyName: string): string | null {
    return FormErrorUtil.getErrorMessage(this.form.get(controlName), controlFriendlyName);
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Emit the updated person object to the parent container
      if(this.person) {
        const updatedPerson: PersonViewModel = {
          ...this.person,
          ...this.form.value,
        };
        this.submitEvent.emit(updatedPerson);
      }
      else {
        const addedPerson: PersonViewModel = {
          ...this.newPerson,
          ...this.form.value,
        };
        this.submitEvent.emit(addedPerson);
      }
      this.form.reset();
    }
  }

  onCancel(): void {
    this.form.reset();
    this.cancelEvent.emit();
  }
}
