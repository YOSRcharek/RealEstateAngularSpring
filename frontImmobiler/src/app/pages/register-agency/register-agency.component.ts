import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-agency',
  templateUrl: './register-agency.component.html',
  styleUrls: ['./register-agency.component.css']
})
export class RegisterAgencyComponent {
  agencyregisterForm: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router
  ) {
    this.agencyregisterForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      adresse: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter pratique pour accéder aux champs
  get f() {
    return this.agencyregisterForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.agencyregisterForm.invalid) {
      return; // stop si formulaire invalide
    }

    const { nom, email, password, adresse } = this.agencyregisterForm.value;

    const agence = { nom: nom, adresse: adresse };
    const user = { nom: nom, email: email, motDePasse: password }; 
    // ⚠️ si ton backend attend "password" au lieu de "motDePasse", change-le ici

    this.auth.registerAgency(agence, user).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        this.router.navigate(['/login']); // redirection après succès
      },
      error: (err) => {
        console.error('Inscription échouée', err);
        this.errorMessage = 'Erreur lors de l\'inscription';
      }
    });
  }
}
