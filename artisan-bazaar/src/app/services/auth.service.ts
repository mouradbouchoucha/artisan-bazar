import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { tap, map } from "rxjs/operators";
import { User, Seller, Customer, SuperAdmin } from "../models/user.model";
import { environment } from "../../environments/environment";

interface SessionData {
  user: User;
  token: string;
  loginTime: number;
  expiresAt: number;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly baseUrl = environment.apiUrl;
  private token: string | null = null;
  private readonly SESSION_TIMEOUT = environment.app.sessionTimeout;
  private sessionCheckInterval: any;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.initializeSession();
  }

  private initializeSession(): void {
    const sessionData = this.getStoredSessionData();
    if (sessionData && this.isSessionValid(sessionData)) {
      this.token = sessionData.token;
      this.currentUserSubject.next(sessionData.user);
      this.startSessionTimeoutCheck();
    } else if (sessionData) {
      // Session expired, clear it
      this.clearStoredSession();
    }
  }

  private getStoredSessionData(): SessionData | null {
    try {
      const sessionStr = localStorage.getItem("sessionData");
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  }

  private isSessionValid(sessionData: SessionData): boolean {
    return Date.now() < sessionData.expiresAt;
  }

  private startSessionTimeoutCheck(): void {
    // Check every minute for session expiration
    this.sessionCheckInterval = setInterval(() => {
      const sessionData = this.getStoredSessionData();
      if (!sessionData || !this.isSessionValid(sessionData)) {
        this.logout();
        alert("Votre session a expiré. Veuillez vous reconnecter.");
      }
    }, 60000); // Check every minute
  }

  private clearStoredSession(): void {
    localStorage.removeItem("sessionData");
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }

  private storeSessionData(user: User, token: string): void {
    const loginTime = Date.now();
    const expiresAt = loginTime + this.SESSION_TIMEOUT;

    const sessionData: SessionData = {
      user,
      token,
      loginTime,
      expiresAt,
    };

    localStorage.setItem("sessionData", JSON.stringify(sessionData));
    // Keep backward compatibility
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  login(email: string, password: string, role: string): Observable<User> {
    return this.http
      .post<{
        user: any;
        token: string;
      }>(`${this.baseUrl}${environment.endpoints.auth.login}`, { email, password, role })
      .pipe(
        tap((res) => {
          const user = res.user as User;
          this.token = res.token;
          this.storeSessionData(user, res.token);
          this.currentUserSubject.next(user);
          this.startSessionTimeoutCheck();
        }),
        map((res) => res.user as User),
      );
  }

  register(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${environment.endpoints.auth.register}`,
      { name, email, password, role },
    );
  }

  logout(): void {
    // Clear session timeout check
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }

    // Clear session data
    this.token = null;
    this.clearStoredSession();
    this.currentUserSubject.next(null);
    this.router.navigate(["/"]);
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  // Type guard methods
  isCustomer(user: User): user is Customer {
    return user.role === "customer";
  }

  isSeller(user: User): user is Seller {
    return user.role === "seller";
  }

  isSuperAdmin(user: User): user is SuperAdmin {
    return user.role === "super_admin";
  }
}
