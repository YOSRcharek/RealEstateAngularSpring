import { Component } from '@angular/core';
import { AnnonceService } from 'src/app/services/annonce.service';
import { Observable } from 'rxjs';
import { Annonce } from 'src/app/entities/annonce.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  constructor(private annonceService: AnnonceService, private router: Router) {}

  filter = {
    type: '',
    statut: '',
    adresse: '',
    titre: '',
    garden: false,
    airCondition: false,
    parking: false,
    internet: false,
    pool: false,
    minPrice: null,
    maxPrice: null,
    minSurface: null,
    maxSurface: null,
    rooms: 2,
    bathrooms: 2,
    bedrooms: 2
  };

  types = [
    { value: '', label: 'All' },
    { value: 'MAISON', label: 'Villa' },
    { value: 'APPARTEMENT', label: 'Appart' },
    { value: 'TERRAIN', label: 'Terrain' }
  ];

  rooms = [1, 2, 3, 4];
  bathrooms = [1, 2, 3, 4];
  bedrooms = [1, 2, 3, 4];

  searchAdvancedVisible = false;

  toggleAdvanced(event: Event) {
    event.preventDefault();
    this.searchAdvancedVisible = !this.searchAdvancedVisible;
  }
setStatut(statut: string) {
  this.filter.statut = statut;
}

  onSearch() {
    console.log('Filtres envoyés :', this.filter);

    this.annonceService.searchAnnonces(this.filter).subscribe({
      next: (result: Annonce[]) => {
        console.log('Résultats reçus :', result);
        this.router.navigate(['/properties'], { state: { annonces: result } });
      },
      error: (err) => {
        console.error('Erreur de recherche :', err);
      }
    });
  }
}
