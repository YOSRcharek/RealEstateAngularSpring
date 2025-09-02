import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.updateUserState();
  }

  updateUserState() {
    this.isLoggedIn = this.auth.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.auth.getUserFromToken();
      this.userEmail = user?.email || null;
      this.userRole = user?.role || null;
    }
  }
showConfirm: boolean = false;

openConfirm() {
  this.showConfirm = true;
}

closeConfirm() {
  this.showConfirm = false;
}


  logout() {
  this.showConfirm = false;
    this.auth.logout();
    this.updateUserState(); // met à jour l’affichage après logout
  }
menuOpen = false;

toggleMenu(event: Event) {
  event.stopPropagation(); // empêche le clic de fermer instantanément
  this.menuOpen = !this.menuOpen;
}

closeMenu() {
  this.menuOpen = false;
}
isAgency(): boolean {
  return localStorage.getItem('role') === 'AGENCY';
}


}
