import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      // déjà connecté → redirige vers la page d’accueil (ou dashboard)
      this.router.navigate(['/authentication/login']);
      return false;
    }
    return true; // pas connecté → accès autorisé
  }
}
