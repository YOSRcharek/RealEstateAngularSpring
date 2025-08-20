import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

ngOnInit(): void {
  const token = this.route.snapshot.queryParamMap.get('token');
  if (token) {
    this.http.get(`http://localhost:8080/api/users/confirm-email?token=${token}`)
      .subscribe({
        next: () => {
          // redirection immédiate vers la page de login
          this.router.navigate(['/login']);
        },
        error: () => {
          // si erreur, tu peux rester sur la page ou gérer l'erreur
          console.error('Erreur lors de la confirmation de l\'email.');
        }
      });
  } else {
    console.error('Token invalide.');
  }
}
}
