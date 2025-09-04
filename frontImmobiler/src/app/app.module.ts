import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { PropertyComponent } from './pages/property/property.component';
import { BenefitComponent } from './components/benefit/benefit.component';
import { ServiceComponent } from './components/service/service.component';
import { RecommendedComponent } from './components/recommended/recommended.component';
import { SliderComponent } from './components/slider/slider.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddPropertyComponent } from './pages/add-property/add-property.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ProfilComponent } from './pages/profil/profil.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RegisterAgencyComponent } from './pages/register-agency/register-agency.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PricingPlanComponent } from './components/pricing-plan/pricing-plan.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DetailPropertyComponent } from './pages/detail-property/detail-property.component';
import { PayementComponent } from './pages/payement/payement.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    FooterComponent,
    TestimonialComponent,
    PropertyComponent,
    BenefitComponent,
    ServiceComponent,
    RecommendedComponent,
    SliderComponent,
    HeaderComponent,
    HomeComponent,
    DashboardComponent,
    AddPropertyComponent,
    ProfilComponent,
    ConfirmEmailComponent,
    RegisterAgencyComponent,
    ResetPasswordComponent,
    PricingPlanComponent,
    PaginationComponent,
    DetailPropertyComponent,
    PayementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,  
     ReactiveFormsModule ,
     
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
