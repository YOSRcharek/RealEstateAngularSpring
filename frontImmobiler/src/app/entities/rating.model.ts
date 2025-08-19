// entities/rating.ts
export interface Rating {
  id: number;
  annonceId: number;
  userId: number;
  note: number; // 1-5
  commentaire?: string;
  date: Date;
}
