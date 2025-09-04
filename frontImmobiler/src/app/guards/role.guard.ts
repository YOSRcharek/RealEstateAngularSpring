import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

canActivate(route: ActivatedRouteSnapshot): boolean {
  const allowedRoles = route.data['roles'] as Array<string>;
  const currentRole = this.auth.getrole();

  if (currentRole && allowedRoles.includes(currentRole)) {
    return true;
  } else {
    this.router.navigate(['/']);
    return false;
  }
}



}
