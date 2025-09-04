import { Annonce } from "./annonce.model";
import { User } from "./user.model";

// entities/rating.ts
export interface Rating {
  id?: number;
  annonce?: Annonce;
  user?: User;
  note?: number; // 1-5
  commentaire?: string;
  date: Date;
}
