
export interface Pet {
  id?: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  gender: 'male' | 'female';
  description: string;
  images: string[];
  location?: string;
  shelter: string;
  species: string;
  vaccinated?: boolean;
  neutered: boolean;
  trained?: boolean;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  status?: 'available' | 'pending' | 'adopted';
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

export interface PetWithRelations {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  adoptionFee: number;
  isAdopted: boolean;
  isActive: boolean;
  shelterID: string;
  breedID: string;
  adoptionID?: string;
  createdAt: string;
  updatedAt: string;
  shelter: {
    id: string;
    name: string;
    country: string;
    state: string;
    city: string;
    address: string;
    phoneNumber: string;
    website?: string;
    description?: string;
  };
  breed: {
    id: string;
    name: string;
    description: string;
    avatarURL: string;
    speciesID: string;
  };
  species: {
    id: string;
    name: string;
  };
}