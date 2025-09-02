import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entities/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AgenceService } from 'src/app/services/agence.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Annonce } from 'src/app/entities/annonce.model';
import { AnnonceService } from 'src/app/services/annonce.service';
import { ImageAnnonce } from 'src/app/entities/image-annonce.model';
import { VisitePlateformService } from 'src/app/services/visite-plateform.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {


photoUrl: string = '';

  userEmail: string | null = null;
  userRole: string | null = null;
  selectedTab: string = 'account';
  selectedFile: File | null = null;
  currentUser: User = {
    id: 0,
    nom: '',
    email: '',
    role: ''
  }
  annonces: Annonce[] = [];
  annonceToDelete?: Annonce;
  showConfirm = false;
  totalAnnonces: number = 0;
  annoncesLastWeek: number = 0;
  totalVisits: number = 0;
  visitsLastWeek: number = 0;
  visitsThisWeek: number = 0;
  totalUsers: number = 0;
  totalSubscribers: number = 0;
  totalAgencies: number = 0;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private agenceService: AgenceService,
    private annonceService: AnnonceService,
    private visiteService: VisitePlateformService,
    private http: HttpClient,
    private router: Router
  ) {}

 ngOnInit(): void {
  this.loadAnnonces();
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
            proprietaire: user,
          };
        }
        this.currentUser = user;

        // ⚡ Initialiser photoUrl avec l'image existante
        if (user.id) {
          this.photoUrl = 'http://localhost:8080/api/photos/' + user.id;
        }
      },
      error: (err) => console.error("Erreur lors du chargement de l'utilisateur", err)
    });
  }
  this.visiteService.getAllStats().subscribe({
            next: (res) => {
                this.totalVisits = res.total_visites;
                this.visitsLastWeek = res.visites_last_week;
                this.visitsThisWeek = res.nombre_visites_semaine;
                 this.totalAnnonces = res.total_annonces;
                this.annoncesLastWeek = res.annonces_last_week;                      
                this.totalUsers = res.total_users;
                this.totalSubscribers = res.subscribers;
                this.totalAgencies = res.total_agences;
                 },
            error: (err) => console.error('Erreur récupération stats', err)
        });
    
}
getStatusClass(status: string): string {
  switch (status) {
    case 'RENT':
      return 'status-sold';
    case 'SALE':
      return 'status-rent';
    default:
      return 'status-default';
  }
}

loadAnnonces() {
  this.annonceService.getAll().subscribe(data => {
    if (this.currentUser && this.currentUser.agence) {
      const agenceId1 = this.currentUser.agence.id;
      this.annonces = data.filter((annonce: any) => annonce.agence?.id === agenceId1);

    } 
  });
}

   editAnnonce(id: number) {
   this.router.navigate(['/annonces/edit', id]);
  }

 confirmDelete(annonce: Annonce) {
    this.annonceToDelete = annonce;
    this.showConfirm = true;
  }

  // Fermer la popup
  closeConfirm() {
    this.showConfirm = false;
    this.annonceToDelete = undefined;
  }

  // Supprimer l'annonce après confirmation
  deleteAnnonce() {
    if (!this.annonceToDelete) return;
    if (this.annonceToDelete?.id != null) {
      this.annonceService.delete(this.annonceToDelete.id).subscribe({
          next: () => {
            // Supprime localement de la liste
            this.annonces = this.annonces.filter(a => a.id !== this.annonceToDelete?.id);
            this.closeConfirm();
            alert('Annonce deleted successfully!');
          },
          error: (err) => {
            console.error('Error deleting annonce', err);
            alert('Failed to delete annonce!');
            this.closeConfirm();
          }
        });
    }

   
  }
  getImageBase64(img: ImageAnnonce): string {
    return img.image ? `data:image/jpeg;base64,${img.image}` : '';
  }
selectTab(tab: string) {
  this.selectedTab = tab.toLowerCase();
}


  confirmAndSave() {
    if (confirm("Are you sure you want to save these changes?")) {
      this.saveChanges();
    }
  }

  saveChanges() {
  if (!this.currentUser) return;

if (this.currentUser.role === 'USER'||this.currentUser.role === 'SUBSCRIBER') {
  const token = this.authService.getToken(); // JWT stocké
  const headers = { 'Authorization': `Bearer ${token}` };

  // Créer un objet sans la circularité
  const userToUpdate = {
    nom: this.currentUser.nom
  };

  this.http.put<User>(`http://localhost:8080/api/users/${this.currentUser.id}`, userToUpdate, { headers })
    .subscribe({
      next: (res) => {
        console.log("✅ User updated successfully", res);
        alert("Profil utilisateur mis à jour !");
        if (this.selectedFile) {
          this.uploadPhoto();
        }
      },
      error: (err) => {
        console.error("❌ Error updating user", err);
        alert("Échec de la mise à jour !");
      }
    });
}


  else if (this.currentUser.role === 'AGENCE' && this.currentUser.agence) {
    // 👉 Cas Agence
    const agence = this.currentUser.agence;
    agence.proprietaire = { id: this.currentUser.id } as any;

    this.agenceService.update(agence.id, agence).subscribe({
      next: (res) => {
        console.log("✅ Agence updated successfully", res);
        alert("Agency updated successfully!");

        if (this.selectedFile) {
          this.uploadPhoto();
        }
      },
      error: (err) => {
        console.error("❌ Error updating agency", err);
        alert("Failed to update agency!");
      }
    });
  } 
  else {
    console.warn("⚠️ Aucun cas valide trouvé pour le rôle:", this.currentUser.role);
  }
}


onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    this.selectedFile = input.files[0];
    this.confirmAndUpload();
  }
}

// ⚡ Afficher un confirm avant l'upload
confirmAndUpload() {
  if (confirm("Do you want to update the profile picture?")) {
    this.uploadPhoto();
  }
}

uploadPhoto() {
  if (!this.selectedFile || !this.currentUser) return;

  const formData = new FormData();
  formData.append("file", this.selectedFile);
  formData.append("userId", this.currentUser.id.toString());

  this.http.post("http://localhost:8080/api/photos/upload", formData, { responseType: 'text' })
    .subscribe({
      next: () => {
        console.log("✅ Upload réussi");

        // ⚡ Mettre à jour la photo immédiatement
        this.photoUrl = 'http://localhost:8080/api/photos/' + this.currentUser.id + '?t=' + new Date().getTime();
      },
      error: (err) => console.error("Erreur upload:", err)
    });
}
goToAddProperty() {
  this.router.navigate(['/add-property']);
}

showForm: 'password' | 'delete' | null = null;


deleteAccount() {
  if (confirm('Do you really want to delete your account?')) {
    console.log('Deleting account...');
    // Appel API pour supprimer le compte
  }
}

passwordForm = {
  oldPassword: '',
  newPassword: ''
};

changePassword(form: any) {
  if (form.invalid || !this.passwordForm.oldPassword || !this.passwordForm.newPassword) {
    alert('Please fill both fields');
    return;
  }

  const token = this.authService.getToken(); // JWT stocké
  const headers = { 'Authorization': `Bearer ${token}` };
console.log(this.passwordForm);

  this.http.put('http://localhost:8080/api/users/change-password', this.passwordForm, { headers, responseType: 'text'  })
    .subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.passwordForm.oldPassword = '';
        this.passwordForm.newPassword = '';
        this.showForm = null; // cache le formulaire
      },
      error: err => {
        console.error(err);
        alert('Failed to change password. Please check your old password.');
      }
    });
}
isAgency(): boolean {
  return localStorage.getItem('role') === 'AGENCY';
}
isSubscriber(): boolean {
  return localStorage.getItem('role') === 'SUBSCRIBER';
}
isUser(): boolean {
  return localStorage.getItem('role') === 'USER';
}
goToDetail(annonceId: number | undefined) {
  if (annonceId) {
    this.router.navigate(['/detail-property', annonceId]);
  }
}
}