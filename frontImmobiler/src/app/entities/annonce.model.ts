import { Agence } from "./agence.model";
import { ImageAnnonce } from "./image-annonce.model";

// entities/annonce.ts
export interface Annonce {
  id?: number;
  titre: string;
  description: string;
  prix: number;
  typeBien: string;
  surface: number;
  nbPieces: number;
  adresse: string;
  statut: string;
  bedrooms?: number;
  bathrooms?: number;
  guestRooms?: number;
  garden?: boolean;
  airCondition?: boolean;
  parking?: boolean;
  internet?: boolean;
  pool?: boolean;
  agence?: Agence;
  images: ImageAnnonce[];
  agencePhoto?: string; // ✅ pour stocker la photo en base64
}
