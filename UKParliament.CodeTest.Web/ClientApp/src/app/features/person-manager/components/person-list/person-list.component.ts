import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonViewModel } from '../../models/person-view-model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, NgxPaginationModule, RouterModule ],
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
}
