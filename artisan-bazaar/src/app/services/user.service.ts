import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getUsers(role?: string): Observable<User[]> {
    const url = role ? `${this.baseUrl}/users?role=${encodeURIComponent(role)}` : `${this.baseUrl}/users`;
    return this.http.get<any[]>(url).pipe(map(items => items.map(item => ({
      id: item.id,
      email: item.email,
      name: item.name,
      role: item.role || 'customer',
      createdAt: new Date(item.created_at)
    }) as User)));
  }
}
