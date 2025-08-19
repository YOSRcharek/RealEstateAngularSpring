// src/app/services/image-annonce.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageAnnonce } from '../entities/image-annonce.model'; // créer l'interface ImageAnnonce

@Injectable({
  providedIn: 'root'
})
export class ImageAnnonceService {

  private baseUrl = 'http://localhost:8080/api/images'; // backend URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<ImageAnnonce[]> {
    return this.http.get<ImageAnnonce[]>(this.baseUrl);
  }

  getById(id: number): Observable<ImageAnnonce> {
    return this.http.get<ImageAnnonce>(`${this.baseUrl}/${id}`);
  }

  getByAnnonce(annonceId: number): Observable<ImageAnnonce[]> {
    return this.http.get<ImageAnnonce[]>(`${this.baseUrl}/annonce/${annonceId}`);
  }

  create(image: ImageAnnonce): Observable<ImageAnnonce> {
    return this.http.post<ImageAnnonce>(this.baseUrl, image);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
