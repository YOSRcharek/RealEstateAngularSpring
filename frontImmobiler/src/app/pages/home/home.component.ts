import { Component } from '@angular/core';
import { User } from 'src/app/entities/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { VisitePlateformService } from 'src/app/services/visite-plateform.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userEmail: string | null = null;
  userRole: string | null = null;
  currentUser: User = {
    id: 0,
    nom: '',
    email: '',
    role: ''
  }
  constructor(private visiteService: VisitePlateformService, private authService: AuthService,private userService: UserService) {

  }

  ngOnInit(): void { const decodedUser = this.authService.getUserFromToken();
    this.userEmail = decodedUser?.email || null;
    this.userRole = decodedUser?.role || null;
      if (this.userEmail) {
    this.userService.findByEmail(this.userEmail).subscribe({
      next: (user) => {
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

      },
      error: (err) => console.error("Erreur lors du chargement de l'utilisateur", err)
    });
  }
    this.visiteService.createVisite('sess-home', this.currentUser.id).subscribe();
  }

}
