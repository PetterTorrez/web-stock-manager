import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendError } from '../../core/models/product.model';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isSessionExpired = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const expiredParam = this.route.snapshot.queryParamMap.get('expired');
    if (expiredParam === 'true') {
      this.isSessionExpired.set(true);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Correo o contraseña invalidos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.isSessionExpired.set(false);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        if (this.authService.currentUserRole() === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 0) {
          this.errorMessage.set('No hay conexión con el servidor.');
        } else {
          const backendErr = err.error as BackendError;
          this.errorMessage.set('Credenciales inválidas.');
        }
      },
    });
  }
}
