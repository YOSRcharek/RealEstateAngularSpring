import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-agence-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-agence-dialog.component.html',
})
export class AddAgenceDialogComponent {

  newUser: any = { nom: '', email: '', motDePasse: '', role: 'AGENCY' };
  newAgence: any = { nom: this.newUser.nom, adresse: '', emailPerso: '', telephone: '', proprietaire: this.newUser.id };

  selectedFile?: File;
  previewUrl: string = 'assets/images/profile/user-1.jpg';

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<AddAgenceDialogComponent>
  ) {}

  onFileChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

addUser() {
  // Copier les valeurs actuelles
  this.newAgence.nom = this.newUser.nom;
  this.newAgence.proprietaire = this.newUser;

  console.log('Adding agence with user:', this.newAgence, this.newUser, this.selectedFile);

  this.authService.registerAgency(this.newAgence, this.newUser, this.selectedFile)
    .subscribe({
      next: (createdAgence: any) => {
        console.log('✅ Agence + User ajoutés', createdAgence);
        this.dialogRef.close(createdAgence);
      },
      error: (err) => console.error('❌ Erreur création agence', err)
    });
}


  onCancel() {
    this.dialogRef.close();
  }
}

