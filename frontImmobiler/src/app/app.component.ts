import { Component, OnInit } from '@angular/core';
import { VisitePlateformService } from './services/visite-plateform.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service'; // <- si tu as ce service pour charger user

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  currentUser: any = null;

  constructor(
    private visiteService: VisitePlateformService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // vérifier si connecté
    if (this.authService.isLoggedIn()) {
      const decodedUser = this.authService.getUserFromToken();
      const userEmail = decodedUser?.email || null;

      if (userEmail) {
        this.userService.findByEmail(userEmail).subscribe({
          next: (user) => {
            // si user n’a pas d’agence, on crée un placeholder
            if (!user.agence) {
              user.agence = {
                id: 0,
                nom: '',
                adresse: '',
                telephone: 0,
                emailPerso: '',
                proprietaire: user,
              };
            }

            this.currentUser = user;

            // ⚡ appeler createVisite seulement après avoir récupéré l'utilisateur
            const sessionId = 'sess-' + Date.now();
            this.visiteService.createVisite(sessionId, this.currentUser.id).subscribe({
              next: res => console.log('Visite enregistrée', res),
              error: err => console.error('Erreur visite', err)
            });
          },
          error: (err) => console.error("Erreur lors du chargement de l'utilisateur", err)
        });
      }
    }
  }
}
