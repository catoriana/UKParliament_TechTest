import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { PersonStore } from '../../services/person.store';

@Component({
  selector: 'app-person-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './person-delete.component.html',
  styleUrl: './person-delete.component.scss',
})
export class PersonDeleteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly personStore = inject(PersonStore);
  person = this.personStore.selectedPerson;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        if (this.person() == null) {
          // this.personStore.loadPersons();
          this.personStore.selectPerson(Number(idParam));
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/person-manager']);
  }

  onDelete(personId: number | undefined): void {
    if (personId) {
      this.personStore.deletePerson(personId);
      this.onCancel();
    }
  }
}
