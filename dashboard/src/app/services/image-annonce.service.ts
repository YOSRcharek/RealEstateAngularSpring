import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ImageAnnonce } from '../entities/image-annonce.model';

@Injectable({
  providedIn: 'root'
})
export class ImageAnnonceService {
  private apiUrl = 'http://localhost:8080/api/images';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ⚡ Upload multiple files
  uploadImages(annonceId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('annonceId', annonceId.toString());

    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
  }

  // ⚡ Récupérer toutes les images d’une annonce
  getImagesByAnnonce(annonceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/annonce/${annonceId}`);
  }

  // ⚡ Charger une image unique
  getImage(id: number): string {
    return `${this.apiUrl}/${id}`;
  }
delete(imageId: number): Observable<any> {
  const token = this.authService.getToken(); // récupérer le JWT
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.delete(`http://localhost:8080/api/images/${imageId}`, { headers });
}
  getByAnnonceId(annonceId: number): Observable<ImageAnnonce[]> {
    return this.http.get<ImageAnnonce[]>(`${this.apiUrl}/annonce/${annonceId}`);
  }


}
