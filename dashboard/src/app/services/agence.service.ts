import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agence } from '../entities/agence.model';
import { User } from '../entities/user.model';

// --- Agence model ---


@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  private apiUrl = 'http://localhost:8080/api/agences'; // backend base URL

  constructor(private http: HttpClient) {}

  // Get all agences
  getAll(): Observable<Agence[]> {
         const token = localStorage.getItem('token'); // récupère le JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Agence[]>(this.apiUrl, { headers } );
  }

  // Get agence by id
  getById(id: number): Observable<Agence> {
    return this.http.get<Agence>(`${this.apiUrl}/${id}`);
  }

  // Create agence
  create(agence: Agence): Observable<Agence> {
    return this.http.post<Agence>(this.apiUrl, agence);
  }
register(agence: any, user: any): Observable<any> {
  const body = { agence, user }; // ça correspond à AgenceRegisterRequest
  return this.http.post<any>(`${this.apiUrl}/register`, body);
}


  // Update agence
  update(id: number, agence: Agence): Observable<Agence> {
       const token = localStorage.getItem('token'); // récupère le JWT
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    return this.http.put<Agence>(`${this.apiUrl}/${id}`, agence,{headers});
  }
updateAgence(agence: Agence, file?: File) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('agence', new Blob([JSON.stringify(agence)], { type: 'application/json' }));

    return this.http.put<Agence>(`${this.apiUrl}/${agence.id}`, formData, { headers });
  } else {
    return this.http.put<Agence>(`${this.apiUrl}/${agence.id}`, agence, { headers });
  }
}

  // Delete agence
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get agences by proprietaire (userId)
  getByProprietaire(userId: number): Observable<Agence[]> {
    return this.http.get<Agence[]>(`${this.apiUrl}/proprietaire/${userId}`);
  }
}
