import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/entities/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { EditUserDialogComponent } from 'src/app/components/edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from 'src/app/components/add-user-dialog/add-user-dialog.component';
import { AgenceService } from 'src/app/services/agence.service';
import { EditAgenceDialogComponent } from 'src/app/components/edit-agence-dialog/edit-agence-dialog.component';
import { AddAgenceDialogComponent } from 'src/app/components/add-agence-dialog/add-agence-dialog.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnnonceService } from 'src/app/services/annonce.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-agences',
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
     RouterModule,
  ],
  templateUrl: './agences.component.html',
  styles: ``
})
export class AppAgencesComponent implements OnInit {
  displayedColumns: string[] = ['photo', 'nom', 'email','proprietes','phone','adresse','personalEmail','dateCreation', 'status', 'actions'];
  dataSource: User[] = [];
 agenceId!: number;
  annonces: any[] = [];

  constructor(private userService: UserService,
    private dialog: MatDialog, private agenceService : AgenceService,
    private route: ActivatedRoute, private annonceService: AnnonceService,
    private router: Router) {}

ngOnInit(): void {
  this.userService.getAll().subscribe((users) => {
    
    this.dataSource = users.filter(user => !['ADMIN', 'USER','SUBSCRIBER'].includes(user.role)) // <-- exclure les admins
    .map(user => ({
      ...user,
      photoUrl: user.photo && user.photo.length > 0
        ? 'http://localhost:8080/api/photos/' + user.id
        : 'assets/images/profile/user-1.jpg' // image par défaut si pas de photo
    }));
  });
  this.route.queryParams.subscribe(params => {
      this.agenceId = +params['agenceId']; // convertir en number
      this.loadAnnonces();
    });
}
goToProperties(agenceId: number) {
  this.annonceService.getAll().pipe(
    map(annonces => annonces.filter(annonce => annonce.agence?.id === agenceId))
  ).subscribe(result => {
    this.router.navigate(['/managements/properties'], { state: { annonces: result } });
  });
}
  loadAnnonces() {
    this.annonceService.getAll().pipe(
      map(annonces => annonces.filter(annonce => annonce.agence?.id === this.agenceId))
    ).subscribe(data => {
      this.annonces = data;
    });
  }

  getImageBase64(img: Uint8Array): string {
    return img ? `data:image/jpeg;base64,${this.arrayBufferToBase64(img)}` : '';
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
 openConfirmDialog(userId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this user?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteUser(userId);
      }
    });
  }

  deleteUser(id: number) {

  this.userService.delete(id).subscribe({
    next: () => {
      // tu peux recharger la liste après suppression
      this.dataSource = this.dataSource.filter(user => user.id !== id);
    },
    error: (err) => {
      console.error('Erreur lors de la suppression', err);
    }
  });
}
  openEditDialog(user: User) {
    const dialogRef = this.dialog.open(EditAgenceDialogComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.user) {
        const updatedUser: User = result.user;
       if (updatedUser.id){
        // Appeler ton nouveau endpoint updateDTO
        this.userService.updateUserDTO(updatedUser!.id, updatedUser, result.file).subscribe({
          next: (savedUser) => {

            // rafraîchir la table
            this.dataSource = this.dataSource.map(u =>
              u.id === savedUser.id ? savedUser : u
            );
          },
          error: (err) => {
            console.error('❌ Erreur update DTO', err);
          }
        });
      }}
    });
  }

openAddDialog() {
  const dialogRef = this.dialog.open(AddAgenceDialogComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(newAgence => {
    if (newAgence) {
      this.dataSource.push(newAgence);
      this.dataSource = [...this.dataSource]; // refresh table
    }
  });
}

}
