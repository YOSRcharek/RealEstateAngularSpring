import { User } from "./user.model";

// entities/agence.ts
export interface Transaction {
  id?: number;
  userId?: number;
  adresse: string;
  createdAt?: Date;
  planName?: string;      // PRO PLAN, PREMIUM PLAN...
  amount?: number;        // Montant payé
  currency?: string;      // ex: "usd"
  status?: string; 
userName?: string;   // <-- ajouté
  photoUrl?: string;   // <-- ajouté
}
