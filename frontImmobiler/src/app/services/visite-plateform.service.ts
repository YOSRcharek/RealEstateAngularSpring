// src/app/services/visite-plateforme.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; // crée l'interface correspondante
import { VisitePlateforme } from '../entities/visite-plateform.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VisitePlateformService {
 
  private baseUrl = 'http://localhost:8080/api/visites';

  constructor(private http: HttpClient,private authService :AuthService) { }

  
   getAllStats(): Observable<any> {
         const token = this.authService.getToken(); // récupérer le JWT
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }); 
       return this.http.get(`${this.baseUrl}/AllStats`, { headers });
  }
  
  getAll(): Observable<VisitePlateforme[]> {
    return this.http.get<VisitePlateforme[]>(this.baseUrl);
  }

  getById(id: number): Observable<VisitePlateforme> {
    return this.http.get<VisitePlateforme>(`${this.baseUrl}/${id}`);
  }

  getByUser(userId: number): Observable<VisitePlateforme[]> {
    return this.http.get<VisitePlateforme[]>(`${this.baseUrl}/user/${userId}`);
  }

  createVisite(sessionId: string, userId: number): Observable<any> {
    const token = this.authService.getToken(); // récupérer le JWT
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.post(this.baseUrl, {
      sessionId: sessionId,
      user: { id: userId }
    }, { headers });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
