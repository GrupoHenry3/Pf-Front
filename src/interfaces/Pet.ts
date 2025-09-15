export interface Pet {
  id: number;
  dni: string;
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

export interface ApplicationData {
  dni: string;
  birthDate: string;
  adoptionReason: string;
  expectations: string;
  petExperience: string;
  housingType: string;
  housingOwnership: string;
  yardSize: string;
  livingSpace: string;
  workSchedule: string;
  dailyRoutine: string;
  exerciseCommitment: string;
  travelFrequency: string;
  householdMembers: string;
  childrenAges: string;
  currentPets: string;
  petHistory: string;
  additionalInfo: string;
}
