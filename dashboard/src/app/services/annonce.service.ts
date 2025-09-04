import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from '../entities/annonce.model';
import { UpdateAnnonceDTO } from '../entities/UpdateAnnonceDTO.model';
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
        const token = localStorage.getItem('token'); // récupère le JWT
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    return this.http.post<Annonce>(this.apiUrl, annonce, { headers });
  }


addAnnonceWithImage(formData: FormData): Observable<any> {
   const token = localStorage.getItem('token'); // récupère le JWT
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
  return this.http.post<any>(`${this.apiUrl}/withImage`, formData, { headers });
}
updateAnnonceWithImage(formData: FormData) : Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.put(`${this.apiUrl}/withImage`, formData, { headers });
}


  // Update annonce
update(id: number, dto: UpdateAnnonceDTO): Observable<Annonce> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.put<Annonce>(`${this.apiUrl}/updateDash/${id}`, dto, { headers });
}


  // Delete annonce
  delete(id: number): Observable<void> {
       const token = localStorage.getItem('token'); // récupère le JWT
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}`
            });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
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