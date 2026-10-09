export interface Hotel {
  id: string;
  name: string;
  city: 'Semarang' | 'Jepara';
  type: string;
  tagline: string;
  address: string;
  accentColor: string;
  secondaryColor: string;
  deliverablesCount: number;
  imageUri?: string;
  description?: string;
}
