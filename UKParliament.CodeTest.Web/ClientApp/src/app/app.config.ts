import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
//import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
//import { errorHandlingInterceptor } from '@realworld/core/error-handler';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { APP_ROUTES } from './app-routes';
import { environment } from 'src/environments/environment';
//import { API_URL } from '@realworld/core/http-client';
//import { environment } from '@env/environment';
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      APP_ROUTES,
      withViewTransitions(),
      withComponentInputBinding(),
    ),
    provideHttpClient(),
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  ],
};
