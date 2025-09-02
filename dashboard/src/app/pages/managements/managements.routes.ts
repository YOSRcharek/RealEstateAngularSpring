import { Routes } from '@angular/router';
import { AppUsersComponent } from './users/users.component';
import { AppAgencesComponent } from './agences/agences.component';
import { AppPropertiesComponent } from './properties/properties.component';

export const ManagementsRoutes: Routes = [
  {
    path: '',
    children: [
      {
                path: 'users',
                component: AppUsersComponent,
      },
     
    ],
  },
  {
    path: '',
    children: [
      {
                path: 'agences',
                component: AppAgencesComponent,
      },
     
    ],
  },
  {
    path: '',
    children: [
      {
                path: 'properties',
                component: AppPropertiesComponent,
      },
     
    ],
  },
];
