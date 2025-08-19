// entities/agence.ts
export interface Agence {
  id: number;
  nom: string;
  contact: string;
  proprietaireId: number; // user_id
  dateCreation: Date;
}
