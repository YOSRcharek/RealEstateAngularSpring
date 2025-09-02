import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {jwtDecode} from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})

export class AppSideLoginComponent {
  form: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(private router: Router, private auth: AuthService, private http: HttpClient) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    // Auth login
    this.auth.login(email, password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        const decoded: any = jwtDecode(res.token);
        const role = decoded.role;

        if (role === 'ADMIN') {
          this.router.navigate(['/dashboard']); // ADMIN redirection
        } else {
          this.errorMessage = "Vous n'avez pas les droits pour accéder à cette application.";
          localStorage.removeItem('token');
        }
      },
      error: (err) => {
        this.errorMessage = 'Email ou mot de passe invalide';
      }
    });
  }

  // Forgot password
  sendResetEmail() {
    const email = this.form.get('email')?.value;
    if (!email) return alert("Veuillez entrer votre email");

    this.http.post('http://localhost:8080/api/users/dash/forgot-password', { email }, { responseType: 'text' })
      .subscribe({
        next: () => alert("Lien envoyé ! Vérifiez votre email."),
        error: err => alert('Erreur : ' + (err.error?.message || err.error || "Unexpected error"))
      });
  }
}

