export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | string;
  breed: string;
  age: number;
  size: "small" | "medium" | "large" | string;
  gender: "male" | "female" | string;
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
  status: "available" | "adopted" | string;
  dateAdded: string;
}
