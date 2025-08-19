// auth.service.ts
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private roleKey = 'userRole';

  constructor(private userService: UserService, private router: Router) {}

  // Enregistrer le token + rôle
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role) {
        this.setUserRole(decoded.role);
      }
    } catch (err) {
      console.error('Erreur lors du décodage du token', err);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUserRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
  }

  login(email: string, password: string): Observable<any> {
    return this.userService.login(email, password).pipe(
      tap((res: any) => {
        console.log('authService');
        console.log('token', res.token);
        if (res.token) {
          this.setToken(res.token); // rôle extrait automatiquement
        }
      })
    );
  }
}
