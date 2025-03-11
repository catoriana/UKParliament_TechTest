import { Routes } from '@angular/router';
import { PersonManagerContainerComponent } from './components/person-manager-container/person-manager-container.component';
import { PersonDeleteComponent } from './components/person-delete/person-delete.component';
import { PersonManagerComponent } from './components/person-manager/person-manager.component';

export const PERSON_MANAGER_ROUTES: Routes =  [
  {
    path: '',
    component: PersonManagerComponent, // This will be the container for your person manager
    children: [
      {
        path: '',
        component: PersonManagerContainerComponent,
      },
      {
        path: 'delete/:id', // You can have dynamic routes like this
        component: PersonDeleteComponent, // Component for viewing person details
      },
    ],
  },
];