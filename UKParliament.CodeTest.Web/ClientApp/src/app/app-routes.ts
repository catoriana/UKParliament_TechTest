import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { Error404PageComponent } from './core/components/error-404-page/error-404-page.component';
import { AppComponent } from './app.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { PersonManagerContainerComponent } from './features/person-manager/components/person-manager-container/person-manager-container.component';

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
          import('./features/implementation-details/components/implementation-details-container/implementation-details-container.component').then((m) => m.ImplementationDetailsContainerComponent),
      },

    ],
  },
  { path: '**', component: Error404PageComponent },
  
];
