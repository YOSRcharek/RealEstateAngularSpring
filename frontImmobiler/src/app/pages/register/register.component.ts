import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
  this.registerForm = this.fb.group({
    nom: ['', Validators.required],           // <- ajouté
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });
}

onSubmit(): void {
  if (this.registerForm.valid) {
    const { nom, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    // envoyer motDePasse au lieu de password
    this.auth.register({ nom, email, motDePasse: password }).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('Inscription échouée', err);
        this.errorMessage = 'Erreur lors de l\'inscription';
      }
    });
  }
}


  }