import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entities/user.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // ---------------- CRUD ----------------
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---------------- Auth ----------------
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  confirmEmail(token: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/confirm-email?token=${token}`, {
      responseType: 'text',
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // ---------------- Role ----------------
  changeRole(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/role?role=${role}`, {});
  }
  findByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/findbyEmail/${email}`, { responseType: 'json' });
    
  } 
  // ---------------- Stats ----------------
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
