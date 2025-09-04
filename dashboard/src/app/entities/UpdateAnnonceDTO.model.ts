export interface UpdateAnnonceDTO {
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
  agenceId?: number; // juste l'id
  images?: any[];
}
