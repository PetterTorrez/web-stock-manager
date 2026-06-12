import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public-catalog/public-catalog.component').then(
        (m) => m.PublicCatalogComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
