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
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit, AfterViewInit {

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

ngOnInit(): void {
  const annoncesFromState = history.state['annonces'];

  if (annoncesFromState && annoncesFromState.length > 0) {
    this.annonces = annoncesFromState;
    this.updatePaginatedProperties();
  } else {
    this.annonceService.getAll().subscribe(data => {
      this.annonces = data;

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

      this.updatePaginatedProperties();
    });
  }
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
    this.paginatedProperties = this.annonces.slice(start, end); // 🔥 utiliser annonces
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
    case 'AUTRE': return 'Other';
    default: return type;
  }
}


}
