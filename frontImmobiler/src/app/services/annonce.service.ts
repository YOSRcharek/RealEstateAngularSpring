import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from '../entities/annonce.model';

// --- Annonce model ---


@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  private apiUrl = 'http://localhost:8080/api/annonces';

  constructor(private http: HttpClient) {}

  // Get all annonces
  getAll(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(this.apiUrl);
  }

  // Get annonce by id
  getById(id: number): Observable<Annonce> {
    return this.http.get<Annonce>(`${this.apiUrl}/${id}`);
  }

  // Create annonce
  create(annonce: Annonce): Observable<Annonce> {
    return this.http.post<Annonce>(this.apiUrl, annonce);
  }

  // Update annonce
  update(id: number, annonce: Annonce): Observable<Annonce> {
    return this.http.put<Annonce>(`${this.apiUrl}/${id}`, annonce);
  }

  // Delete annonce
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get annonces by zone
  getByZone(zoneId: number): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiUrl}/zone/${zoneId}`);
  }

  // Get annonces by agence
  getByAgence(agenceId: number): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiUrl}/agence/${agenceId}`);
  }
  // Search annonces with filters
searchAnnonces(filter: any): Observable<Annonce[]> {
  let params = new HttpParams();
  Object.keys(filter).forEach(key => {
    if (filter[key] !== null && filter[key] !== '' && filter[key] !== false) {
      params = params.set(key, String(filter[key]));
    }
  });

  return this.http.get<Annonce[]>(`${this.apiUrl}/search`, { params });
}

}