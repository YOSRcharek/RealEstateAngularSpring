import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.css']
})
export class PricingPlanComponent {
 constructor(private router: Router) {}

goToPayment(planName: string, price: number) {
  const token = localStorage.getItem('authToken');
  if (token) {
     //Utilisateur connecté → navigation vers la page de paiement
    this.router.navigate(['/payement'], { state: { planName, price } });
/*  const links: any = {
    'PRO PLAN': 'https://buy.stripe.com/test_8x2aEZcsjfFD6QH2x2f3a01',
    'PREMIUM PLAN': 'https://buy.stripe.com/test_6oU7sN63V0KJb6X4Faf3a00'
  };

  window.open(links[planName], '_blank'); // ouvre Stripe Payment Link*/
  } else {
    // Utilisateur non connecté → redirection vers login
    this.router.navigate(['/signIn']);
  }
}
 
}
