import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../entities/transaction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {} // plus besoin de AuthService

  // ---------------- CRUD ----------------
  getAll(): Observable<Transaction[]> {
    const token = localStorage.getItem('token'); // récupère le JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Transaction[]>(this.apiUrl, { headers });
  }
}