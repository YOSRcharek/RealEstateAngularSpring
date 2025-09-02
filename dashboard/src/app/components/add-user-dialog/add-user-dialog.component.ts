import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-user-dialog',
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
  templateUrl: './add-user-dialog.component.html'
})
export class AddUserDialogComponent {
  newUser: any = { nom: '', email: '', motDePasse: '', role: 'USER' };
  roles: string[] = ['USER', 'SUBSCRIBER'];
  selectedFile?: File;
  previewUrl: string = 'assets/images/profile/user-1.jpg';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {}

  onFileChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    // preview immédiat
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  addUser() {
    // ⚡ Créer l'utilisateur
    this.http.post('http://localhost:8080/api/users/register', this.newUser)
      .subscribe({
        next: (createdUser: any) => {
          console.log('✅ User ajouté', createdUser);

          // ⚡ si fichier photo sélectionné, upload après création
          if (this.selectedFile) {
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('userId', createdUser.id);

            this.http.post('http://localhost:8080/api/photos/upload', formData, { responseType: 'text' })
              .subscribe({
                next: () => console.log('✅ Photo upload réussie'),
                error: (err) => console.error('Erreur upload photo', err)
              });
          }

          this.dialogRef.close(createdUser);
        },
        error: (err) => console.error('Erreur création user', err)
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
