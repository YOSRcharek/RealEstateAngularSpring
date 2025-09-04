// auth.service.ts
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AgenceService } from './agence.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private roleKey = 'role';

  constructor(private userService: UserService, private agenceService: AgenceService, private router: Router) {}

  // Enregistrer le token + rôle
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role) {
        this.setrole(decoded.role);
      }
    } catch (err) {
      console.error('Erreur lors du décodage du token', err);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setrole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  getrole(): string | null {
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

  register(user: any): Observable<any> {
    return this.userService.register(user).pipe(
      tap((res: any) => {
        console.log('authService');
        console.log('token', res.token);
        if (res.token) {
          this.setToken(res.token); // rôle extrait automatiquement
        }
      })
    );
  }
  registerAgency(agence: any, user: any): Observable<any> {
    // Envoie le DTO AgenceRegisterRequest
    return this.agenceService.register(agence, user).pipe(
      tap((res: any) => {
        console.log('authService response', res);
        // Pas de token attendu ici, juste retour de l'agence créée
      })
    );
  }


  getUserFromToken(): { email: string, role: string, permissions: string[] } | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<any>(token);
    return {
      email: decoded.sub,          // on map sub → email
      role: decoded.role,
      permissions: decoded.permissions
    };
  } catch (err) {
    console.error('Erreur de décodage du token', err);
    return null;
  }
}

}
