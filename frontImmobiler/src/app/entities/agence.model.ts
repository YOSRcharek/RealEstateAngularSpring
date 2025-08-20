// entities/agence.ts
export interface Agence {
  id: number;
  nom: string;
  contact: string;
  proprietaire: number; // user_id
  dateCreation: Date;
}
