import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonViewModel } from '../../models/person-view-model';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PdsTableGridComponent, TableColumn } from 'src/app/shared/ui/components/pds-table-grid/pds-table-grid.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, PdsTableGridComponent, RouterModule ],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListComponent {
  @Input() people: PersonViewModel[] = [];
  @Input() selectedPerson: PersonViewModel | null = null;
  @Output() personSelected = new EventEmitter<PersonViewModel>();
  @Output() personDeleted = new EventEmitter<number>();
  @Output() addEvent = new EventEmitter<void>();
    // Pagination property
    currentPage = 1;

  AddPerson(): void {
    this.addEvent.emit();
  }
  
  selectPerson(person: PersonViewModel): void {
    this.personSelected.emit(person);
  }

  deletePerson(personId: number): void {
    this.personDeleted.emit(personId);
  }

  handlePersonAction(event: {item: PersonViewModel, action: string}): void {
    if (event.action === 'edit') {
      this.personSelected.emit(event.item);
    }
    if (event.action === 'delete') {
      this.personDeleted.emit(event.item.id);
    }
  }

     // Define table columns configuration
  tableColumns: TableColumn[] = [
    { header: 'First Name', field: 'firstName' },
    { header: 'Last Name', field: 'lastName' },
    { header: 'Department', field: 'department.name', hideOnMobile: true },
    { 
      header: 'Date of Birth', 
      field: 'dateOfBirth', 
      hideOnMobile: true,
      format: (value: Date) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      } 
    },
    { header: 'Actions', field: 'Update', isAction: true }
  ];
}
