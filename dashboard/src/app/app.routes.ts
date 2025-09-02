import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Routes principales avec FullComponent
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard], // toutes ces routes nécessitent d'être connecté
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }, // seulement ADMIN
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'managements',
        loadChildren: () =>
          import('./pages/managements/managements.routes').then(
            (m) => m.ManagementsRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
      },
    ],
  },

  // Routes publiques / BlankComponent
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
        canActivate: [GuestGuard], // visiteurs non connectés
      },
    ],
  },

  // Wildcard → page erreur
  { path: '**', redirectTo: 'authentication/error' },
];
