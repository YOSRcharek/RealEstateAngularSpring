import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgenceService } from 'src/app/services/agence.service';
import { AnnonceService } from 'src/app/services/annonce.service';
import { UserService } from 'src/app/services/user.service';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

Swiper.use([Pagination]);
@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.css']
})
export class RecommendedComponent implements OnInit, AfterViewInit {

  annonces: any[] = [];          // toutes les annonces
  paginatedProperties: any[] = []; // celles affichées
  currentPage = 1;
  itemsPerPage = 6;

  constructor(
    private annonceService: AnnonceService,
    private userService: UserService,
    private agenceService: AgenceService,
    private http: HttpClient,
    private router: Router
  ) {}

filteredAnnonces: any[] = [];

ngOnInit(): void {
  this.annonceService.getAll().subscribe(data => {
    this.annonces = data;
    console.log(this.annonces);
    this.annonces.forEach(annonce => {
      if (annonce.agence?.id && annonce.agence.proprietaire) {
        const userId = annonce.agence.proprietaire.id;

        this.http.get(`http://localhost:8080/api/users/getPhoto/${userId}`, {
          responseType: 'blob'
        }).subscribe(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            annonce.agencePhoto = reader.result as string;
          };
          reader.readAsDataURL(blob);
        });
      } else {
        annonce.agencePhoto = null;
      }
    });

    // par défaut : afficher toutes les annonces
    this.filteredAnnonces = this.annonces;
    console.log(this.filteredAnnonces);
    this.updatePaginatedProperties();
  });
}

// ✅ Filtrer par type
filterByType(type?: string): void {
  if (!type) {
    this.filteredAnnonces = this.annonces; // tout afficher
  } else {
    this.filteredAnnonces = this.annonces.filter(a => a.typeBien === type);
  }
  this.updatePaginatedProperties();
}


  getFirstImage(annonce: any): string {
    if (annonce.images?.length) {
      return 'data:image/jpeg;base64,' + annonce.images[0].image;
    }
    return 'assets/images/home/defautlHouse.jpg';
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

 updatePaginatedProperties() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedProperties = this.filteredAnnonces.slice(start, end); // ✅ utiliser filteredAnnonces
}

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedProperties();
  }
  getTypeBienLabel(type: string): string {
  switch (type) {
    case 'MAISON': return 'House';
    case 'APPARTEMENT': return 'Apartment';
    case 'TERRAIN': return 'Land';
    default: return type;
  }
}


}

