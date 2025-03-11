import { Routes } from '@angular/router';
import { PersonManagerContainerComponent } from './components/person-manager-container/person-manager-container.component';

export const PERSON_MANAGER_ROUTES: Routes = [
    {
      path: '',
      component: PersonManagerContainerComponent,
    },

  ];