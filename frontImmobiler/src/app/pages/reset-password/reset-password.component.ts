import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  submitted = false;
  loading = false;

  token: string | null = null;

  serverMessage = '';
  serverSuccess = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Read token from ?token=...
    this.token = this.route.snapshot.queryParamMap.get('token');

    // Build reactive form
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // Convenience getter for template
  get f() { return this.resetForm.controls; }

  // Custom validator: confirmPassword must match password
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverMessage = '';

    if (!this.token) {
      this.serverMessage = 'Invalid or missing token.';
      this.serverSuccess = false;
      return;
    }

    if (this.resetForm.invalid) return;

    this.loading = true;

    const payload = {
      token: this.token,
      newPassword: this.f['password'].value
    };

    // Call backend
    this.http.post<{ message: string }>('http://localhost:8080/api/users/reset-password', payload)
      .subscribe({
        next: (res) => {
          this.serverMessage = res?.message || 'Password reset successfully!';
          this.serverSuccess = true;
          this.loading = false;

          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.serverMessage = err?.error?.message || err?.error || 'Reset failed.';
          this.serverSuccess = false;
          this.loading = false;
            this.router.navigate(['/login']);
        }
      });
  }
}
