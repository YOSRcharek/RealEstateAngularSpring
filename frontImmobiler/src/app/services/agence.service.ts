import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agence } from '../entities/agence.model';

// --- Agence model ---


@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  private apiUrl = 'http://localhost:8080/api/agences'; // backend base URL

  constructor(private http: HttpClient) {}

  // Get all agences
  getAll(): Observable<Agence[]> {
    return this.http.get<Agence[]>(this.apiUrl);
  }

  // Get agence by id
  getById(id: number): Observable<Agence> {
    return this.http.get<Agence>(`${this.apiUrl}/${id}`);
  }

  // Create agence
  create(agence: Agence): Observable<Agence> {
    return this.http.post<Agence>(this.apiUrl, agence);
  }

  // Update agence
  update(id: number, agence: Agence): Observable<Agence> {
    return this.http.put<Agence>(`${this.apiUrl}/${id}`, agence);
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
