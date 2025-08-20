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
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.agencyregisterForm = this.fb.group({
      nom: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log('Form submitted', this.agencyregisterForm.value);
    if (this.agencyregisterForm.valid) {
      const { nom, email, password, contact } = this.agencyregisterForm.value;

      const agence = { nom: nom, contact: contact }; 
      const user = { nom: nom, email: email, motDePasse: password }; 

      this.auth.registerAgency(agence, user).subscribe({
        next: (res) => {
          console.log('Inscription réussie', res);
          this.router.navigate(['/login']); // redirige vers login après inscription
        },
        error: (err) => {
          console.log('Inscription échouée', err);
          this.errorMessage = 'Erreur lors de l\'inscription';
        }
      });
    }
  }
}
