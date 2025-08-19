// entities/annonce.ts
export interface Annonce {
  id: number;
  titre: string;
  description: string;
  prix: number;
  typeBien: string;
  surface: number;
  nbPieces: number;
  localisation: { lat: number; lng: number }; // POINT
  zoneId: number;
  statut: string;
  agenceId: number;
  dateCreation: Date;
  dateModification?: Date;
}
