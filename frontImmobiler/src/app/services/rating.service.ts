// src/app/services/rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../entities/rating.model'; // crée l'interface Rating

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private baseUrl = 'http://localhost:8080/api/ratings';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.baseUrl);
  }

  getById(id: number): Observable<Rating> {
    return this.http.get<Rating>(`${this.baseUrl}/${id}`);
  }

  getByAnnonce(annonceId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.baseUrl}/annonce/${annonceId}`);
  }

  getByUser(userId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.baseUrl}/user/${userId}`);
  }

  create(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.baseUrl, rating);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
