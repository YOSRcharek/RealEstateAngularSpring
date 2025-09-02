import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Annonce } from 'src/app/entities/annonce.model';

@Component({
  selector: 'app-details-annonce-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule,  MatButtonModule],
  //templateUrl: './details-annonce-dialog.component.html',
  template: `
   <h2 mat-dialog-title>{{ annonce.titre }}</h2>

<mat-dialog-content class="dialog-content">

  <!-- Images -->
  <div class="images-container" *ngIf="annonce.images.length > 0">
    <div class="image-card" *ngFor="let img of annonce.images">
      <img [src]="'data:image/jpeg;base64,' + img.image" alt="property-image">
    </div>
  </div>

  <!-- Main Information -->
  <div class="info-group">
    <h3><mat-icon>info</mat-icon> Information</h3>
    <p><strong>Description:</strong> {{ annonce.description }}</p>
    <p><strong>Price:</strong> {{ annonce.prix | currency:'TND':'symbol' }}</p>
    <p><strong>Type:</strong> {{ getTypeBienLabel(annonce.typeBien) }}</p>
    <p><strong>Area:</strong> {{ annonce.surface }} m²</p>
    <p><strong>Number of rooms:</strong> {{ annonce.nbPieces }}</p>
    <p><strong>Bedrooms:</strong> {{ annonce.bedrooms }}</p>
    <p><strong>Bathrooms:</strong> {{ annonce.bathrooms }}</p>
    <p><strong>Guest Rooms:</strong> {{ annonce.guestRooms }}</p>
  </div>

  <!-- Amenities -->
  <div class="info-group" *ngIf="getAmenities().length > 0">
    <h3><mat-icon>home_work</mat-icon> Amenities</h3>
    <div class="amenities">
      <div *ngFor="let a of getAmenities()" class="amenity">
        <mat-icon [style.color]="a.color">{{ a.icon }}</mat-icon> {{ a.label }}
      </div>
    </div>
  </div>

  <!-- Agency -->
  <div class="info-group">
    <h3><mat-icon>business</mat-icon> Agency</h3>
    <p><strong>Name:</strong> {{ annonce.agence?.nom }}</p>
    <p><strong>Owner:</strong> {{ annonce.agence?.proprietaire?.nom }}</p>
  </div>

</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button mat-dialog-close>Close</button>
</mat-dialog-actions>


  `,
  styleUrls: ['./details-annonce-dialog.component.scss']
})
export class DetailsAnnonceDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public annonce: Annonce) {}

  getTypeBienLabel(type: string): string {
    switch (type) {
      case 'MAISON': return 'House';
      case 'APPARTEMENT': return 'Apartment';
      case 'TERRAIN': return 'Land';
      case 'AUTRE': return 'Other';
      default: return type;
    }
  }

  // Retourne uniquement les amenities existants
getAmenities(): {label: string, value: boolean, icon: string, color: string}[] {
  return [
    { label: 'Garden', value: !!this.annonce.garden, icon: 'park', color: 'green' },
    { label: 'Air Condition', value: !!this.annonce.airCondition, icon: 'ac_unit', color: 'blue' },
    { label: 'Parking', value: !!this.annonce.parking, icon: 'local_parking', color: 'orange' },
    { label: 'Internet', value: !!this.annonce.internet, icon: 'wifi', color: 'purple' },
    { label: 'Pool', value: !!this.annonce.pool, icon: 'pool', color: 'cyan' }
  ].filter(a => a.value); // ne garde que ceux à true
}

}
