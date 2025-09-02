import { Agence } from "./agence.model";

export interface User {
  id?: number;
  nom: string;
  email: string;
  motDePasse?: string; // hashé côté backend
  role: string;
  confirmeEmail?: boolean;
  dateCreation?: Date;
  agence?: Agence;
  photo?:String;
}
