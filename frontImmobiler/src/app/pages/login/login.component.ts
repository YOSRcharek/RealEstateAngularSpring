// login.component.ts
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  submitted = false; // ➝ pour savoir si l'utilisateur a soumis le formulaire

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] // ➝ min 6 caractères
    });
  }

  // ➝ Getter pratique pour accéder facilement aux champs du formulaire
  get f() {
    return this.loginForm.controls;
  }

onSubmit(): void {
  this.submitted = true;
  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;
  this.auth.login(email, password).subscribe({
    next: (res: any) => {
      console.log('Login réussi', res);

      // Stocker token
      localStorage.setItem('token', res.token);

      // Décoder le token pour obtenir le rôle
      const decoded: any = jwtDecode(res.token);
      const role = decoded.role; // ou "roles" selon ton backend
      window.location.reload();
      // Redirection selon rôle
      if (role === 'ADMIN') {
        this.router.navigate(['/dash']);
      } else if (role === 'AGENCY') {
        this.router.navigate(['/profil']);
      } else {
        this.router.navigate(['/']); // fallback
      }
    },
    error: (err) => {
      console.log('Login failed', err);
      this.errorMessage = 'Email ou mot de passe invalide';
    }
  });
}

sendResetEmail() {
  const email = this.loginForm.get('email')?.value;

  if (!email) {
    alert("Please enter your email to reset your password");
    return;
  }

  this.http.post('http://localhost:8080/api/users/forgot-password', { email },{ responseType: 'text' })
    .subscribe({
      next: () => alert("Link sent! Please check your email. ✅"),
      error: err => {
        console.error(err); // debug dans la console
        // Essaye d'afficher le message si dispo
        const message = err.error?.message || err.error || "Unexpected error";
        alert('Erreur : ' + message);
      }
    });
}



}
