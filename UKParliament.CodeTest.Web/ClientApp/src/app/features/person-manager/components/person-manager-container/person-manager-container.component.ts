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
import { RouterModule } from '@angular/router';
import { PdsPersonEditorComponent } from 'src/app/shared/ui/components/pds-person-editor/pds-person-editor.component';

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
  private personService = inject(PersonService);
  private personStore = inject(PersonStore);
  private departmentService = inject(DepartmentService);

  people = this.personStore.people;
  selectedPerson = this.personStore.selectedPerson;
  departments = signal<DepartmentViewModel[]>([]);

  ngOnInit(): void {
    this.personStore.loadPeople();

    effect(() => {
      this.departmentService.getAll().subscribe((deps) => {
        this.departments.set(deps);
      });
    });
  }

  onPersonSelected(person: PersonViewModel): void {
    this.personStore.selectPerson(person.id);
  }

  onPersonAdded(person: PersonViewModel): void {
    effect(() => {
      this.personService.addPerson(person).subscribe((newPerson) => {
        this.personStore.addPerson(newPerson);
      });
    });
    this.resetState();
  }

  onPersonUpdated(updatedPerson: PersonViewModel): void {
    if (updatedPerson) {
      effect(() => {
      this.personService.updatePerson(updatedPerson).subscribe(() => {
        this.personStore.updatePerson(updatedPerson);
      });
        this.resetState();
      });
    }
    // else {
    //   this.resetState();
    // }
  }

  onPersonDeleted(personId: number): void {
    this.personService.deletePerson(personId).subscribe(() => {
      this.personStore.deletePerson(personId);
      this.resetState();
    });
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
