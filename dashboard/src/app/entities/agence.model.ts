import { User } from "./user.model";

// entities/agence.ts
export interface Agence {
  id?: number;
  nom?: string;
  adresse: string;
  proprietaire: User; 
  dateCreation?: Date;
  telephone:number;
  emailPerso:string;

}
