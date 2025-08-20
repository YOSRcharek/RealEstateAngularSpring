import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PropertyComponent } from './pages/property/property.component';
import { AddPropertyComponent } from './pages/add-property/add-property.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PropertyDetailsComponent } from './pages/property-details/property-details.component';
import { ServiceComponent } from './components/service/service.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BenefitComponent } from './components/benefit/benefit.component';
import { RoleGuard } from './guards/role.guard';
import { GuestGuard } from './guards/guest.guard';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RegisterAgencyComponent } from './pages/register-agency/register-agency.component';

const routes: Routes = [
  // accessibles par tout le monde
  { path: '', component: HomeComponent },
  { path: 'properties', component: PropertyComponent },
  { path: 'services', component: ServiceComponent },
  { path: 'testimonials', component: TestimonialComponent },
  { path: 'benefit', component: BenefitComponent },
  { path: 'signIn', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'signUp', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'propertyDetails/:id', component: PropertyDetailsComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'register-agency', component: RegisterAgencyComponent, canActivate: [GuestGuard] },

  // accessibles uniquement aux admins
  { path: 'dash', component: DashboardComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },

  // accessibles aux admins ET agences
  { path: 'add-property', component: AddPropertyComponent, canActivate: [RoleGuard], },
   // data: { roles: ['ADMIN', 'AGENCE'] } },

  // wildcard
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
