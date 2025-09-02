import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.css']
})
export class PayementComponent {
  planName: string = '';
  price: number = 0;
  stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Utiliser la clé publique Stripe
    this.stripePromise = loadStripe('pk_test_51S2fIbRslJLnRRCO376vokLwiBiN7VEQAROuMjyD2zeDHJx6n6gotyVlBK2g9q9wdutMc243OALYuflxNEHABZ8t009EyjnTmO');

    // Récupération des données envoyées via router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.planName = navigation.extras.state['planName'] || '';
      this.price = navigation.extras.state['price'] || 0;
    }
  }
async checkout() {
  const stripe = await this.stripePromise;
  if (!stripe) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    this.router.navigate(['/signIn']);
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.post<{ id: string }>(
    'http://localhost:8080/api/payment/create-checkout-session',
    { amount: this.price }, // on envoie le prix
    { headers }
  ).subscribe(async (session) => {
    await stripe.redirectToCheckout({ sessionId: session.id });
  }, (err) => {
    console.error('❌ Erreur backend:', err);
  });
}




  updateCard(t: any, id: string) {
    const elem = document.getElementById(id) as HTMLElement;
    let num: string = t.value;

    if (id === 'visualNumber') {
      if (num.length > 16) {
        t.value = num.substr(0, 16);
        num = t.value;
      }
      num = num.match(/.{1,4}/g)?.join(' ') || num;
    }
    elem.innerText = num;
  }

  protect(t: any, end: number) {
    const num: string = t.value;
    t.value = num.substr(num.length - end, end);
  }


}
