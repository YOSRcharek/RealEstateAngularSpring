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

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './users.component.html',
})
export class AppUsersComponent implements OnInit {
  displayedColumns: string[] = ['photo', 'nom', 'email', 'role', 'dateCreation', 'status', 'actions'];
  dataSource: User[] = [];

  constructor(private userService: UserService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((users) => {

      this.dataSource = users.filter(user => !['ADMIN', 'AGENCY'].includes(user.role)) // <-- exclure les admins
      .map(user => ({
        ...user,
        photoUrl: user.photo && user.photo.length > 0
          ? 'http://localhost:8080/api/photos/' + user.id
          : 'assets/images/profile/user-1.jpg' // image par défaut si pas de photo
      }));
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
  const dialogRef = this.dialog.open(EditUserDialogComponent, {
    width: '500px',
    data: { ...user }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.userService.updateUser(result.user, result.file).subscribe({
        next: (updatedUser) => {
          this.dataSource = this.dataSource.map(u =>
            u.id === updatedUser.id ? updatedUser : u
          );
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
    }
  
  });

}
openAddDialog() {
  const dialogRef = this.dialog.open(AddUserDialogComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(newUser => {
    if (newUser) {
      // ⚡ Ajouter le nouvel utilisateur à ton dataSource
      this.dataSource.push(newUser);
      // pour que la table se rafraîchisse
      this.dataSource = [...this.dataSource];
    }
  });

}
}
