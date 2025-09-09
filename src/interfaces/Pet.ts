
export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  gender: 'male' | 'female';
  description: string;
  images: string[];
  location: string;
  shelterId: string;
  shelterName: string;
  vaccinated: boolean;
  neutered: boolean;
  trained: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  status: 'available' | 'pending' | 'adopted';
  dateAdded: string;
}