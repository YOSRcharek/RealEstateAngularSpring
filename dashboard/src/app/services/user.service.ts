import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entities/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {} // plus besoin de AuthService

  // ---------------- CRUD ----------------
  getAll(): Observable<User[]> {
    const token = localStorage.getItem('token'); // récupère le JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
      const token = localStorage.getItem('token'); // récupère le JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
   // Update user
    update(id: number, user: User): Observable<User> {
          const token = localStorage.getItem('token'); // récupère le JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
      return this.http.put<User>(`${this.apiUrl}/${id}`, user,{headers});
    }
  // user.service.ts
updateUser(user: User, file?: File) {
        const token = localStorage.getItem('token'); // récupère le JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  if (file) {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    formData.append('file', file);

    return this.http.put<User>(`${this.apiUrl}/${user.id}`, formData,{headers});
  } else {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user,{headers});
  }
}
updateUserDTO(id: number, user: User, file?: File) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  if (file) {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    formData.append('file', file);

    return this.http.put<User>(`${this.apiUrl}/updateDTO/${id}`, formData, { headers });
  } else {
    return this.http.put<User>(`${this.apiUrl}/updateDTO/${id}`, user, { headers });
  }
}


  // ---------------- Auth ----------------
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  confirmEmail(token: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/confirm-email?token=${token}`, { responseType: 'text' });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // ---------------- Role ----------------
  changeRole(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/role?role=${role}`, {});
  }

  findByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/findbyEmail/${email}`);
  }

  // ---------------- Stats ----------------
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
