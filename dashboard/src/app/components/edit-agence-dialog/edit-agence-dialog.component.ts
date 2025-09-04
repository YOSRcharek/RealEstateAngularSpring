import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/entities/user.model';

@Component({
  selector: 'app-edit-agence-dialog',
 standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-agence-dialog.component.html'
})
export class EditAgenceDialogComponent {
  previewUrl: string = 'assets/images/profile/user-1.jpg'; // fallback
  selectedFile?: File;
  currentUser!: User;


  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditAgenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  ngOnInit() {
    this.currentUser = this.data;

    // ⚡ initialiser la photo existante si l'user a déjà une photo
    if (this.currentUser.id) {
      this.previewUrl =
        'http://localhost:8080/api/photos/' + this.currentUser.id;
    }
  }

  onFileChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    // afficher preview immédiat
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  uploadPhoto() {
    if (!this.selectedFile || !this.currentUser) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('userId', this.currentUser.id!.toString());

    this.http
      .post('http://localhost:8080/api/photos/upload', formData, {
        responseType: 'text'
      })
      .subscribe({
        next: () => {
          console.log('✅ Upload réussi');
          // ⚡ forcer refresh avec cache-busting
          this.previewUrl =
            'http://localhost:8080/api/photos/' +
            this.currentUser.id +
            '?t=' +
            new Date().getTime();
        },
        error: (err) => console.error('Erreur upload:', err)
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

onSave() {
  // on renvoie user + file au parent
  this.dialogRef.close({
    user: this.currentUser,
    file: this.selectedFile
  });
}

}
