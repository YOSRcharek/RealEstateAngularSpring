// add-property.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,Route, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AnnonceService } from '../../services/annonce.service';
import { Annonce } from 'src/app/entities/annonce.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/entities/user.model';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ImageAnnonceService } from 'src/app/services/image-annonce.service';
import { debounceTime, Subject } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements OnInit {

  // Form fields
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
  garden = false;
  airCondition = false;
  parking = false;
  internet = false;
  pool = false;
  query = '';

  // Images
  selectedFiles: File[] = [];
  selectedFilesPreview: string[] = [];
  existingImages: { id: number, url: string }[] = [];

  // Map & autocomplete
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker | null;
  suggestions: any[] = [];
  searchSubject = new Subject<string>();

  submitted = false;
  isEditMode = false;
  currentAnnonceId?: number;
  currentUser: User = { id: 0, nom: '', email: '', role: '' };
   @ViewChild('formRef') formRef!: NgForm;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private annonceService: AnnonceService,
    private imageAnnonceService: ImageAnnonceService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}
 
  ngOnInit(): void {
    // Récupérer l'utilisateur courant
    const decodedUser = this.authService.getUserFromToken();
    if (decodedUser?.email) {
      this.userService.findByEmail(decodedUser.email).subscribe({
        next: user => this.currentUser = user,
        error: err => console.error(err)
      });
    }

    // Mapbox
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoieW9zcmNoYXJlazMxIiwiYSI6ImNsdDZkd2JzcTBjcHYybW12NzE4aGNseDYifQ.pv6x004655o_tl9uncoxag';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });
    this.marker = null;

    this.searchSubject.pipe(debounceTime(300)).subscribe(q => this.fetchSuggestions(q));

    // Vérifier si on est en mode édition
    const annonceId = +this.route.snapshot.paramMap.get('id')!;
    if (annonceId) {
      this.isEditMode = true;
      this.annonceService.getById(annonceId).subscribe({
        next: res => {
          Object.assign(this, res);
          this.existingImages = res.images?.map((img: any) => ({
            id: img.id,
            url: 'data:image/jpeg;base64,' + img.image
          })) || [];
          this.currentAnnonceId = res.id;
          this.query = res.adresse || '';
        },
        error: err => console.error(err)
      });
    }
  }

  predictPrice() {
  const payload = {
    Area: this.surface,
    room: this.nbPieces,
    bathroom: this.bathrooms,
    garage: this.parking, // si tu n’as pas ce champ dans le formulaire, tu peux mettre 0 ou ajouter input
    garden: this.garden ? 1 : 0,
    pool: this.pool ? 1 : 0,
    furnished: 0, // si tu n’as pas ce champ, mettre 0
    air_conditioning: this.airCondition ? 1 : 0,
    location: this.query || "Unknown"
  };
    console.log('Predicting price with:', payload);

  this.http.post<{ prix_estime_tnd: number }>('http://127.0.0.1:5000/predict', payload)
  .subscribe({
    next: res => {
      alert(`Prix estimé (TND) : ${res.prix_estime_tnd.toFixed(2)}`);
      this.prix = res.prix_estime_tnd; // met le prix estimé dans le champ prix
    },
    error: err => console.error('Erreur prediction:', err)
  });

}

  // Gestion des images
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

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.selectedFilesPreview.splice(index, 1);
  }

  removeExistingImage(imageId: number) {
    this.imageAnnonceService.delete(imageId).subscribe({
      next: () => this.existingImages = this.existingImages.filter(img => img.id !== imageId),
      error: err => console.error(err)
    });
  }

  uploadImages() {
    if (!this.currentAnnonceId || this.selectedFiles.length === 0) return;

    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('files', file));
    formData.append('annonceId', this.currentAnnonceId.toString());

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
          this.selectedFilesPreview = [];
        },
        error: err => console.error(err)
      });
  }

  // Mapbox autocomplete
  fetchSuggestions(query: string) {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${(mapboxgl as any).accessToken}`)
      .then(res => res.json())
      .then(data => this.suggestions = data.features)
      .catch(err => console.error(err));
  }

  onSearch() {
    if (this.query.length < 2) {
      this.suggestions = [];
      return;
    }
    this.searchSubject.next(this.query);
  }

  selectFeature(feature: any) {
    this.query = feature.place_name;
    this.suggestions = [];
  }

  // Soumission formulaire
  saveAnnonce() {
  
    this.submitted = true;
    if (this.formRef?.invalid) {
      return; // stop si formulaire invalide
    }
    if (!this.titre || !this.description || !this.prix || !this.surface || !this.typeBien || !this.statut) {
      return; // validation simple côté TS
    }

    if (!this.currentUser?.agence?.id) {
      alert('Agence non définie');
      return;
    }

const payload: Annonce = {    // 0 si création
  titre: this.titre,
  description: this.description,
  prix: this.prix!,
  surface: this.surface!,
  nbPieces: this.nbPieces!,
  bedrooms: this.bedrooms!,
  bathrooms: this.bathrooms!,
  guestRooms: this.guestRooms!,
  typeBien: this.typeBien!,
  statut: this.statut!,
  garden: this.garden,
  airCondition: this.airCondition,
  parking: this.parking,
  internet: this.internet,
  pool: this.pool,
  adresse: this.query,
  agence: {
    id: this.currentUser.agence.id,
    nom: this.currentUser.agence.nom || '',
      proprietaire: {
    id: this.currentUser.id,
    nom: this.currentUser.nom,
    email: this.currentUser.email,
    role: this.currentUser.role
  }
  },
  images: []

};

    if (this.isEditMode && this.currentAnnonceId) {
      this.annonceService.update(this.currentAnnonceId, payload).subscribe({
        next: res => {
          if (this.selectedFiles.length) this.uploadImages();
          this.router.navigate(['/profil']);
        },
        error: err => console.error(err)
      });
    } else {
      this.annonceService.create(payload).subscribe({
        next: res => {
          this.currentAnnonceId = res.id;
          if (this.selectedFiles.length) this.uploadImages();
          this.resetForm();
          this.router.navigate(['/profil']);
        },
        error: err => console.error(err)
      });
    }
  }

  resetForm() {
    this.titre = '';
    this.description = '';
    this.prix = null;
    this.surface = null;
    this.nbPieces = null;
    this.bedrooms = null;
    this.bathrooms = null;
    this.guestRooms = null;
    this.typeBien = '';
    this.statut = '';
    this.garden = false;
    this.airCondition = false;
    this.parking = false;
    this.internet = false;
    this.pool = false;
    this.query = '';
    this.selectedFiles = [];
    this.selectedFilesPreview = [];
    this.submitted = false;
  }

}