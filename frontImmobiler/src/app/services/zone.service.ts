// src/app/services/zone.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zone } from '../entities/zone.model'; // créer l'interface correspondante

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private baseUrl = 'http://localhost:8080/api/zones';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.baseUrl);
  }

  getById(id: number): Observable<Zone> {
    return this.http.get<Zone>(`${this.baseUrl}/${id}`);
  }

  getByParent(parentId: number): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.baseUrl}/parent/${parentId}`);
  }

  create(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(this.baseUrl, zone);
  }

  update(id: number, zone: Zone): Observable<Zone> {
    return this.http.put<Zone>(`${this.baseUrl}/${id}`, zone);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
