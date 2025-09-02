import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AnnonceService } from 'src/app/services/annonce.service';
import { Annonce } from 'src/app/entities/annonce.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/entities/user.model';
import { Agence } from 'src/app/entities/agence.model';
import { AgenceService } from 'src/app/services/agence.service';

@Component({
  selector: 'app-add-annonce-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './add-annonce-dialog.component.html'
})
export class AddAnnonceDialogComponent implements OnInit {
  submitted = false;
selectedAgenceId!: number;

  // champs du formulaire
  titre = '';
  description = '';
  prix: number | null = null;
  surface: number | null = null;
  nbPieces: number | null = null;
  bedrooms: number | null = null;
  bathrooms: number | null = null;
  guestRooms: number | null = null;
  typeBien = '';
  statut = '';
  adresse = '';
  garden = false;
  airCondition = false;
  parking = false;
  internet = false;
  pool = false;

  // images
  selectedFiles: File[] = [];
  selectedFilesPreview: string[] = [];
  agences: Agence[] = [];   // liste des agences
  selectedAgence!: Agence;  // agence choisie
  currentUser!: User;
agenceId!: number; // ou string selon ton API

  constructor(
    private dialogRef: MatDialogRef<AddAnnonceDialogComponent>,
    private annonceService: AnnonceService,
    private authService: AuthService,
    private userService: UserService,
    private agenceService: AgenceService
  ) {
    // récupérer utilisateur courant
    const decoded = this.authService.getUserFromToken();
    if (decoded?.email) {
      this.userService.findByEmail(decoded.email).subscribe(user => {
        this.currentUser = user;
      });
    }
  }
  ngOnInit(): void {
   this.agenceService.getAll().subscribe((res) => {
      this.agences = res;
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.selectedFiles = Array.from(input.files);
    this.selectedFilesPreview = [];

    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => this.selectedFilesPreview.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

saveAnnonce() {
  const formData = new FormData();

  // ✅ Construire l'objet annonce
  const annonceData: any = {
    titre: this.titre,
    description: this.description,
    prix: this.prix,
    surface: this.surface,
    nbPieces: this.nbPieces,
    bedrooms: this.bedrooms,
    bathrooms: this.bathrooms,
    guestRooms: this.guestRooms,
    typeBien: this.typeBien,
    statut: this.statut,
    garden: this.garden,
    airCondition: this.airCondition,
    parking: this.parking,
    internet: this.internet,
    pool: this.pool,
    adresse: this.adresse,
    agence: { id: this.selectedAgenceId }   // ✅ bien utiliser l’ID sélectionné
  };

  // ✅ ajouter l’objet JSON dans FormData
  formData.append(
    "annonce",
    new Blob([JSON.stringify(annonceData)], { type: "application/json" })
  );

  // ✅ ajouter toutes les images sélectionnées
  if (this.selectedFiles && this.selectedFiles.length > 0) {
    this.selectedFiles.forEach(file => {
      formData.append("images", file);
    });
  }

  // ✅ appel service
  this.annonceService.addAnnonceWithImage(formData).subscribe({
    next: (res) => {
      console.log("Annonce créée avec succès :", res);
      this.dialogRef.close(res);  // fermer dialog si succès
    },
    error: (err) => {
      console.error("Erreur lors de la création :", err);
    }
  });
}


}
