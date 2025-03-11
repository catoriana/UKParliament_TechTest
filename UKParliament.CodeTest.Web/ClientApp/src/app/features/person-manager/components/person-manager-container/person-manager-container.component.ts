import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PersonStore } from '../../services/person.store';
import { PersonService } from '../../services/person.service';
import { PersonViewModel } from '../../models/person-view-model';
import { PersonListComponent } from '../person-list/person-list.component';
import { DepartmentService } from '../../services/department.service';
import { DepartmentViewModel } from '../../models/department-view-model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PdsPersonEditorComponent } from 'src/app/shared/ui/components/pds-person-editor/pds-person-editor.component';
import { DepartmentStore } from '../../services/department.store';

@Component({
  selector: 'app-person-manager-container',
  standalone: true,
  imports: [
    PersonListComponent,
    PdsPersonEditorComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './person-manager-container.component.html',
  styleUrl: './person-manager-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonManagerContainerComponent implements OnInit {
  private personStore = inject(PersonStore);
  private departmentStore = inject(DepartmentStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = this.personStore.isLoading;
  people = this.personStore.people;
  selectedPerson = this.personStore.selectedPerson;
  departments = this.departmentStore.departments;

  ngOnInit(): void {
    this.personStore.loadPeople();
    this.departmentStore.loadDepartments();
  }

  onPersonSelected(person: PersonViewModel): void {
    this.personStore.selectPerson(person.id);
  }

  onPersonAdded(person: PersonViewModel): void {
    if (person) {
      this.personStore.addPerson(person);
    }
  }

  onPersonUpdated(person: PersonViewModel): void {
    if (person) {
      this.personStore.updatePerson(person);
    }
  }

  onPersonDeleted(personId: number): void {
    //this.personStore.deletePerson(personId);
    if(personId) {
      this.personStore.selectPerson(personId);
      this.router.navigate(['delete', personId],  { relativeTo: this.route });
    }

  }

  onCancel(): void {
    this.resetState();
  }

  onAdd(): void {
    this.resetState();
  }

  private resetState(): void {
    this.personStore.selectPerson(null);
  }
}
