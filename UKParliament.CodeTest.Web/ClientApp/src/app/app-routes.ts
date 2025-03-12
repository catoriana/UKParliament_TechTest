import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { PersonManagerContainerComponent } from './features/person-manager/components/person-manager-container/person-manager-container.component';
import { ErrorPageComponent } from './core/components/error-page/error-page.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'person-manager', // Redirect to person-manager by default
        pathMatch: 'full',  // Use 'full' to ensure full matching
      },
      {
        path: 'person-manager',
        loadChildren: () =>
          import('./features/person-manager/person-manager.routes').then((m) => m.PERSON_MANAGER_ROUTES),
      },
      {
        path: 'implementation',
        loadComponent: () =>
          import('./features/implementation/components/implementation-details/implementation-details.component').then((m) => m.ImplementationDetailsComponent),
      },
      {
        path: 'error',
        component: ErrorPageComponent
      },

    ],
  },
  { path: '**',  redirectTo: 'person-manager' } // Redirect to person-manager by default },
  
];
