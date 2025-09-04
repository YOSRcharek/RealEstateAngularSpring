import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Annonce } from 'src/app/entities/annonce.model';
import { ImageAnnonce } from 'src/app/entities/image-annonce.model';
import { Rating } from 'src/app/entities/rating.model';
import { User } from 'src/app/entities/user.model';
import { AnnonceService } from 'src/app/services/annonce.service';
import { AuthService } from 'src/app/services/auth.service';
import { RatingService } from 'src/app/services/rating.service';
import { UserService } from 'src/app/services/user.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-detail-property',
  templateUrl: './detail-property.component.html',
  styleUrls: ['./detail-property.component.css']
})
export class DetailPropertyComponent implements OnInit   {

  annonce: Annonce = {
    titre: '',
    description: '',
    adresse: '',
    prix: 0,
    surface: 0,
    nbPieces: 0,
    typeBien: '',
    statut: '',
    bedrooms: 0,
    bathrooms: 0,
    guestRooms: 0,
    garden: false,
    airCondition: false,
    parking: false,
    internet: false,
    pool: false,
    id: 0,
    images: [],
  };
  
ratings: Rating[] = [];

  newRating: Rating = {

    annonce: undefined,
    user:undefined,
    note: undefined,
    commentaire: '',
    date: new Date()
  };

  currentUser: User = {
    id: 0,
    nom: '',
    email: '',
    role: ''
  };
rating: number = 0;
stars: number[] = [1, 2, 3, 4, 5];
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
review = {
  comment: '',
  rating: 0
};
 isLoggedIn = false;
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService,
    private ratingService: RatingService,
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient
  ) {}

ngOnInit(): void {
  const annonceId = Number(this.route.snapshot.paramMap.get('id'));

  if (annonceId) {
    this.annonceService.getById(annonceId).subscribe({
      next: async (data) => {
        this.annonce = data;

        // Charger les ratings
        if (this.annonce?.id != null) {
          this.ratingService.getByAnnonce(this.annonce.id).subscribe(r => {
            this.ratings = r;
          });
        }

        // Initialiser annonceId dans le newRating
        this.newRating.annonce = this.annonce;

        // 👉 Init map seulement si on a une adresse
        if (this.annonce.adresse && this.annonce.adresse.trim() !== '') {
          await this.initMap(this.annonce.adresse);
        }
      },
      error: (err) => console.error('Erreur de récupération annonce', err)
    });

    this.loadRatings(annonceId);
  }

  // Charger utilisateur connecté
  const decodedUser = this.authService.getUserFromToken();
  this.userEmail = decodedUser?.email || null;
  this.userRole = decodedUser?.role || null;

  if (this.userEmail) {
    this.userService.findByEmail(this.userEmail).subscribe({
      next: (user) => {
        if (!user.agence) {
          user.agence = {
            id: 0,
            nom: '',
            adresse: '',
            telephone: 0,
            emailPerso: '',
            proprietaire: user
          };
        }
        this.currentUser = user;
        this.newRating.user = this.currentUser;
      },
      error: (err) =>
        console.error("Erreur lors du chargement de l'utilisateur", err)
    });
  }

  (mapboxgl as any).accessToken =
    'pk.eyJ1IjoieW9zcmNoYXJlazMxIiwiYSI6ImNsdDZkd2JzcTBjcHYybW12NzE4aGNseDYifQ.pv6x004655o_tl9uncoxag';
}

// Nouvelle fonction qui initialise la carte
async initMap(adresse: string) {
  try {
    const coords = await this.geocodeAdresse(adresse);

    this.map = new mapboxgl.Map({
      container: 'mapAnnonce',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coords,
      zoom: 13
    });

    this.marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(coords)
      .setPopup(new mapboxgl.Popup().setText(adresse)) // 👉 popup adresse
      .addTo(this.map);

  } catch (error) {
    console.error('Erreur lors du géocodage :', error);
  }
}

// Fonction pour géocoder l'adresse
async geocodeAdresse(adresse: string): Promise<[number, number]> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(adresse)}.json?access_token=${(mapboxgl as any).accessToken}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error('Adresse introuvable');
  }
  return data.features[0].center; // [lng, lat]
}


  loadRatings(annonceId: number) {
    this.http.get<Rating[]>(`http://localhost:8080/api/ratings/annonce/${annonceId}`)
      .subscribe({
        next: (res) => {this.ratings = res, console.log('Ratings chargés:', this.ratings);},
        error: (err) => console.error('Erreur récupération ratings', err)
      });
  }
  setRating(star: number) {
    this.newRating.note = star;
      this.rating = star;
  this.review.rating = star;
  }

  updateUserState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getUserFromToken();
      this.userEmail = user?.email || null;
      this.userRole = user?.role || null;
    }
  }
submitReview() {
  if (!this.review.comment || this.review.rating <= 0) {
    console.error("Commentaire ou note manquant !");
    return;
  }

  if (!this.annonce || !this.currentUser) {
    console.error("Annonce ou utilisateur manquant !");
    return;
  }

  const token = this.authService.getToken();
  const headers = { Authorization: `Bearer ${token}` };

  const ratingPayload = {
    annonce: { id: Number(this.route.snapshot.paramMap.get('id'))}, // on envoie juste l'id, JPA va résoudre l'objet
    user: { id: this.currentUser.id },
    note: this.review.rating,
    commentaire: this.review.comment,
    date: new Date() // ou Date.now()
  };
 console.log('Payload rating:', ratingPayload);
  this.http.post<Rating>('http://localhost:8080/api/ratings', ratingPayload,{headers})
    .subscribe({
      next: (saved) => {
        this.ratings.push(saved); // ajoute le nouveau rating à la liste
        this.review.comment = '';
        this.review.rating = 0;
        
      },
      error: (err) => console.error('Erreur enregistrement rating', err)
    });
}
isUser(): boolean {
  return localStorage.getItem('role') === 'USER';
}

getStatusClass(status: string): string {
  switch (status) {
    case 'SALE':
      return 'status-sold';
    case 'RENT':
      return 'status-rent';
    default:
      return 'status-default';
  }
}
getImageBase64(img: ImageAnnonce): string {
  return img && img.image ? `data:image/jpeg;base64,${img.image}` : 'assets/images/no-image.jpg';
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

getStatutLabel(statut: string): string {
  switch (statut) {
    case 'DISPONIBLE': return 'Available';
    case 'VENDU': return 'Sold';
    case 'EN_LOCATION': return 'Rent';
    default: return statut;
  }
}

}
