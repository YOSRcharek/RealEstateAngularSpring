// entities/zone.ts
export interface Zone {
  id: number;
  nom: string;
  type: 'gouvernorat' | 'delegation' | 'localite';
  parentId?: number;
}
