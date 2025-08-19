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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'properties', component: PropertyComponent },
  { path: 'dash', component: DashboardComponent },
  { path: 'services', component: ServiceComponent},
  { path: 'testimonials', component: TestimonialComponent },
  { path: 'benefit', component: BenefitComponent},
  { path: 'signIn', component: LoginComponent },
  { path: 'signUp', component: RegisterComponent },
  { path: 'propertyDetails/:id', component: PropertyDetailsComponent},
  { path: 'add-property', component: AddPropertyComponent },
  { path: '**', redirectTo: '' } // wildcard pour les routes inconnues
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
