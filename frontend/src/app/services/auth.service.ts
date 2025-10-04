import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User, UserRegister, UserLogin, AuthResponse, UpdateProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (this.isAuthenticated()) {
      this.loadCurrentUser();
    }
  }

  register(userData: UserRegister): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.loadCurrentUser();
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap((user) => this.currentUserSubject.next(user))
    );
  }

  updateProfile(data: UpdateProfile): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/profile`, data).pipe(
      tap(() => this.loadCurrentUser())
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadCurrentUser(): void {
    this.getProfile().subscribe({
      error: () => this.logout()
    });
  }

  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private removeToken(): void {
    localStorage.removeItem('authToken');
  }
}
