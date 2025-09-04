import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AnnonceService } from 'src/app/services/annonce.service';   // ⚡ nouveau service pour annonces
import { HttpClient } from '@angular/common/http';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import { Annonce } from 'src/app/entities/annonce.model';
import { DetailsAnnonceDialogComponent } from 'src/app/components/details-annonce-dialog/details-annonce-dialog.component';
import { AddAnnonceDialogComponent } from 'src/app/components/add-annonce-dialog/add-annonce-dialog.component';
import { EditAnnonceDialogComponent } from 'src/app/components/edit-annonce-dialog/edit-annonce-dialog.component';

Swiper.use([Pagination]);
@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './properties.component.html',
  styles: ``
})
export class AppPropertiesComponent implements OnInit, AfterViewInit {

  // Colonnes affichées
  displayedColumns: string[] = ['photo','type', 'nom','statut', 'prix', 'adresse', 'dateCreation' , 'actions'];

  annonces: Annonce[] = [];              // toutes les annonces
  paginatedProperties: Annonce[] = [];   // celles affichées
  currentPage = 1;
  itemsPerPage = 6;
  noPropertyMessage: string;

  constructor(
    private annonceService: AnnonceService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

ngOnInit(): void {
  const annoncesFromState = history.state['annonces'];

  if (annoncesFromState !== undefined) {
    // ✅ State existe
    if (annoncesFromState.length > 0) {
      this.annonces = annoncesFromState;
    } else {
      this.annonces = []; // vide
      this.noPropertyMessage = "There is no property for this agency";
  
    }
  } else {
    // 🔄 Pas de state, charger toutes les annonces
    this.annonceService.getAll().subscribe(data => {
      this.annonces = data;

      // Charger la photo de l'agence (si dispo)
      this.annonces.forEach(annonce => {
        if (annonce.agence?.proprietaire?.id) {
          const userId = annonce.agence.proprietaire.id;
          this.http.get(`http://localhost:8080/api/users/getPhoto/${userId}`, { responseType: 'blob' })
            .subscribe(blob => {
              const reader = new FileReader();
              reader.onload = () => annonce.agencePhoto = reader.result as string;
              reader.readAsDataURL(blob);
            });
        } else {
          annonce.agencePhoto = 'assets/images/default-agence.png';
        }
      });
    });
  }
}


  getFirstImage(annonce: any): string {
    if (annonce.images?.length) {
      return 'data:image/jpeg;base64,' + annonce.images[0].image;
    }
    return 'assets/images/defautlHouse.jpg';
   
  }

  ngAfterViewInit(): void {
    new Swiper('.swiper', {
      slidesPerView: 3,
      spaceBetween: 15,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        767: { slidesPerView: 1 },
        1024: { slidesPerView: 2 },
        1440: { slidesPerView: 3 }
      }
    });
  }

 

  getTypeBienLabel(type: string): string {
    switch (type) {
      case 'MAISON': return 'House';
      case 'APPARTEMENT': return 'Apartment';
      case 'TERRAIN': return 'Land';
      case 'AUTRE': return 'Other';
      default: return type;
    }
  }

  openConfirmDialog(annonceId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this property?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteAnnonce(annonceId);
      }
    });
  }

  deleteAnnonce(id: number) {
    this.annonceService.delete(id).subscribe({
      next: () => {
        this.annonces = this.annonces.filter(a => a.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddAnnonceDialogComponent, {
      width: '500px'
    });
  
     dialogRef.afterClosed().subscribe(newAnnonce => {
      if (newAnnonce) {
        this.annonces.push(newAnnonce);
      }
    });
  }
openEditDialog(annonce: Annonce) {
  this.dialog.open(EditAnnonceDialogComponent, {
    width: '500px',
    data: { annonce } // ✔️ ici tu envoies { annonce: annonce }
  });
}

  openDetailDialog(annonce: any) {
    this.dialog.open(DetailsAnnonceDialogComponent, {
      width: '600px',
      data: annonce
    });
  }
}
