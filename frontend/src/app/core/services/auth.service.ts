import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, AuthUser, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  private authUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  authUser$ = this.authUserSubject.asObservable();

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get currentUser(): AuthUser | null {
    return this.authUserSubject.value;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/login`, request).pipe(
      tap(response => {
        if (response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error(response.message || 'Login failed');
        }
        return response.data;
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/register`, request).pipe(
      tap(response => {
        if (response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error(response.message || 'Registration failed');
        }
        return response.data;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthSuccess(data: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
    
    const user: AuthUser = {
      email: data.email,
      fullName: data.fullName,
      role: data.role
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.authUserSubject.next(user);
  }

  private getStoredUser(): AuthUser | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }
}
