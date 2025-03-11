import { Routes } from '@angular/router';
import { PersonManagerContainerComponent } from './components/person-manager-container/person-manager-container.component';
import { PersonDeleteComponent } from './components/person-delete/person-delete.component';

export const PERSON_MANAGER_ROUTES: Routes =  [
  {
    path: '',
    component: PersonManagerContainerComponent, // This will be the container for your person manager
    children: [
      {
        path: 'delete/:id', // You can have dynamic routes like this
        component: PersonDeleteComponent, // Component for viewing person details
      },
    ],
  },
];