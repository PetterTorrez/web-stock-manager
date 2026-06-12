import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public-catalog/public-catalog.component').then(
        (m) => m.PublicCatalogComponent,
      ),
  },
  //   {
  //     path: '**',
  //     redirectTo: '',
  //   },
];
