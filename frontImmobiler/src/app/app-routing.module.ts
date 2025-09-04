import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PropertyComponent } from './pages/property/property.component';
import { AddPropertyComponent } from './pages/add-property/add-property.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ServiceComponent } from './components/service/service.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BenefitComponent } from './components/benefit/benefit.component';
import { RoleGuard } from './guards/role.guard';
import { GuestGuard } from './guards/guest.guard';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RegisterAgencyComponent } from './pages/register-agency/register-agency.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { DetailPropertyComponent } from './pages/detail-property/detail-property.component';
import { PayementComponent } from './pages/payement/payement.component';

const routes: Routes = [
  // accessibles par tout le monde
  { path: '', component: HomeComponent },
  { path: 'properties', component: PropertyComponent },
  { path: 'services', component: ServiceComponent },
  { path: 'testimonials', component: TestimonialComponent },
  { path: 'benefit', component: BenefitComponent },
  { path: 'signIn', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'signUp', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'register-agency', component: RegisterAgencyComponent, canActivate: [GuestGuard] },
  { path: 'profil', component: ProfilComponent},
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [GuestGuard] },

  // accessibles uniquement aux admins
  { path: 'dash', component: DashboardComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'payement', component: PayementComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'AGENCY','USER','SUBSCRIBER'] } },


  // accessibles aux admins ET AGENCYs
  { path: 'detail-property/:id', component: DetailPropertyComponent},
  { path: 'add-property', component: AddPropertyComponent, canActivate: [RoleGuard],  data: { roles: ['ADMIN', 'AGENCY'] } },
  { path: 'annonces/edit/:id', component: AddPropertyComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'AGENCY'] } },
  // wildcard
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
