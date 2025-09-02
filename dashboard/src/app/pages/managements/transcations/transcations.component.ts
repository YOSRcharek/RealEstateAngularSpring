import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/entities/transaction.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-transcations',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './transcations.component.html',
  styles: ``
})
export class AppTranscationsComponent implements OnInit {
  displayedColumns1: string[] = ['photo', 'nom', 'planName', 'amount', 'currency', 'status', 'createdAt', 'actions'];
  dataSource1: any[] = []; // tableau de transactions enrichies avec user

  constructor(
    private transactionService: TransactionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.transactionService.getAll().subscribe({
      next: (transactions) => {
        // Charger chaque user pour compléter les infos
        transactions.forEach(transaction => {
          this.userService.getById(transaction.userId!).subscribe(userData => {
            this.dataSource1.push({
              ...transaction,
              nom: userData.nom,
              photoUrl: userData.photo && userData.photo.length > 0 
                ? 'http://localhost:8080/api/photos/' + userData.id
                : 'assets/images/profile/user-1.jpg'
            });
          });
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions:', err);
      }
    });
  }
}
