import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse, UserTokenPayload } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private tokenSignal = signal<string | null>(localStorage.getItem('jwt_token'));

  public isAuthenticated = computed(() => !!this.tokenSignal());

  public currentUserRole = computed(() => {
    const token = this.tokenSignal();
    if (!token) return null;

    try {
      const jwtPairsCount = 3;
      const jwtPayloadIndex = 1;

      const parts = token.split('.');
      if (parts.length !== jwtPairsCount) return null;

      const payload: UserTokenPayload = JSON.parse(atob(parts[jwtPayloadIndex]));
      return payload.role || null;
    } catch (error) {
      console.error('Error crítico al decodificar el token de sesión:', error);
      return null;
    }
  });

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('jwt_token', res.token);
        this.tokenSignal.set(res.token);
      }),
    );
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.tokenSignal.set(null);
  }
}
