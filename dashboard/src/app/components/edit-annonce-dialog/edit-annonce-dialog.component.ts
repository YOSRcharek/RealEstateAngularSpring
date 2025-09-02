import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Annonce } from 'src/app/entities/annonce.model';
import { UpdateAnnonceDTO } from 'src/app/entities/UpdateAnnonceDTO.model';
import { AnnonceService } from 'src/app/services/annonce.service';
import { Agence } from 'src/app/entities/agence.model';
import { AgenceService } from 'src/app/services/agence.service';
import { ImageAnnonceService } from 'src/app/services/image-annonce.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-annonce-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ annonce.id ? 'Edit Property' : 'Add Property' }}</h2>

    <mat-dialog-content>
    

      <!-- Form Fields -->
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="annonce.titre" name="titre" required />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Description</mat-label>
        <textarea matInput rows="3" [(ngModel)]="annonce.description" name="description"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Price</mat-label>
        <input type="number" matInput [(ngModel)]="annonce.prix" name="prix" required />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Type</mat-label>
        <mat-select [(ngModel)]="annonce.typeBien" name="typeBien" required>
          <mat-option value="MAISON">House</mat-option>
          <mat-option value="APPARTEMENT">Apartment</mat-option>
          <mat-option value="TERRAIN">Land</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="annonce.statut" name="statut" required>
          <mat-option value="RENT">Rent</mat-option>
          <mat-option value="SALE">Sale</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Agence</mat-label>
        <mat-select [(ngModel)]="annonce.agence" name="agence" [compareWith]="compareAgence" required>
          <mat-option *ngFor="let ag of agences" [value]="ag">{{ ag.nom }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Address</mat-label>
        <input matInput [(ngModel)]="annonce.adresse" name="adresse" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Surface (m²)</mat-label>
        <input type="number" matInput [(ngModel)]="annonce.surface" name="surface" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Number of rooms</mat-label>
        <input type="number" matInput [(ngModel)]="annonce.nbPieces" name="nbPieces" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Bedrooms</mat-label>
        <input type="number" matInput [(ngModel)]="annonce.bedrooms" name="bedrooms" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Bathrooms</mat-label>
        <input type="number" matInput [(ngModel)]="annonce.bathrooms" name="bathrooms" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Guest Rooms</mat-label>
        <input type="number" matInput [(ngModel)]="annonce.guestRooms" name="guestRooms" />
      </mat-form-field>

      <!-- Options -->
      <div class="options-grid">
        <mat-checkbox [(ngModel)]="annonce.garden" name="garden">Garden</mat-checkbox>
        <mat-checkbox [(ngModel)]="annonce.airCondition" name="airCondition">Air Conditioning</mat-checkbox>
        <mat-checkbox [(ngModel)]="annonce.parking" name="parking">Parking</mat-checkbox>
        <mat-checkbox [(ngModel)]="annonce.internet" name="internet">Internet</mat-checkbox>
        <mat-checkbox [(ngModel)]="annonce.pool" name="pool">Swimming Pool</mat-checkbox>
      </div>

        <!-- Photo + Upload -->
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
         <div class="flex gap-2 flex-wrap mt-2" *ngIf="existingImages.length > 0">
        <div *ngFor="let img of existingImages" class="relative">
          <img [src]="img.url" alt="Annonce image" width="120" height="80" style="object-fit:cover; border-radius:6px;">
          <button (click)="removeExistingImage(img.id)"> 🗑️</button>
        </div>
      </div>
        <input type="file" accept="image/*" multiple (change)="onFileSelected($event)" />
        <button mat-stroked-button color="primary" (click)="uploadImages()" [disabled]="!selectedFiles.length">
          Upload Photo
        </button>
      </div>

     
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .w-100 { width: 100%; }
    mat-dialog-content { display: flex; flex-direction: column; gap: 16px; }
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
  `]
})
export class EditAnnonceDialogComponent implements OnInit {
  annonce: Annonce = {} as Annonce;
  agences: Agence[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  existingImages: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { annonce: Annonce },
    private dialogRef: MatDialogRef<EditAnnonceDialogComponent>,
    private annonceService: AnnonceService,
    private imageAnnonceService: ImageAnnonceService,
    private agenceService: AgenceService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

 ngOnInit(): void {
  this.loadAgences();

  if (this.data?.annonce) {
    this.annonce = { ...this.data.annonce };
    this.existingImages = this.annonce.images?.map((img: any) => ({
      id: img.id,
      url: 'data:image/jpeg;base64,' + img.image
    })) || [];
  }
}

  compareAgence(a1: Agence | undefined, a2: Agence | undefined) {
    return a1?.id === a2?.id;
  }

  loadAgences() {
    this.agenceService.getAll().subscribe(res => {
      this.agences = res;
      // Relier correctement l'agence existante pour le select
      if (this.data?.annonce?.agence) {
        this.annonce.agence = this.agences.find(a => a.id === this.data.annonce?.agence?.id);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.previewUrls = this.selectedFiles.map(file => URL.createObjectURL(file));
  }

  removeExistingImage(imageId: number) {
    this.imageAnnonceService.delete(imageId).subscribe({
      next: () => this.existingImages = this.existingImages.filter(img => img.id !== imageId),
      error: err => console.error(err)
    });
  }

  uploadImages() {
    if (!this.annonce.id || this.selectedFiles.length === 0) return;

    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('files', file));
    formData.append('annonceId', this.annonce.id.toString());

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post<any[]>('http://localhost:8080/api/images/upload-multiple', formData, { headers })
      .subscribe({
        next: uploaded => {
          this.existingImages = [
            ...this.existingImages,
            ...uploaded.map(img => ({ id: img.id, url: 'data:image/jpeg;base64,' + img.image }))
          ];
          this.selectedFiles = [];
          this.previewUrls = [];
        },
        error: err => console.error(err)
      });
  }

  close() {
    this.dialogRef.close();
  }
save() {
  if (!this.annonce.id) return;

  const dto: UpdateAnnonceDTO = {
    ...this.annonce,
    agenceId: this.annonce.agence?.id,  // juste l'ID
    images: this.annonce.images || []
  };

  this.annonceService.update(this.annonce.id, dto).subscribe({
    next: res => {
      if (this.selectedFiles.length) this.uploadImages();
      this.dialogRef.close(res);
    },
    error: err => console.error(err)
  });
}


}
