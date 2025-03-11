import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PersonStore } from '../../services/person.store';

@Component({
  selector: 'app-person-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './person-delete.component.html',
  styleUrl: './person-delete.component.scss'
})
export class PersonDeleteComponent {
  personStore = inject(PersonStore);
  person = this.personStore.selectedPerson;
  private router = inject(Router);
  
  onCancel(): void {
    this.router.navigate(['/person-manager']);
  }

  onPersonDlete(personId: number): void {
    if(personId) {
      this.personStore.deletePerson(personId);
    }

  }

}
