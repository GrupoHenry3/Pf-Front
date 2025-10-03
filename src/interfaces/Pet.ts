import { Breed } from "./Breed";
import { Shelter } from "./Shelter";
import { Species } from "./Species";

export interface Pet {
  id?: string;
  name: string;
  species?: Species;
  breed?: Breed;
  age: number;
  size: 'Small' | 'Medium' | 'Large';
  gender: 'Male' | 'Female';
  description?: string;
  avatarURL: string;
  photos?: string[];
  shelter?: Shelter;
  vaccinated?: boolean;
  neutered?: boolean;
  trained?: boolean;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  isAdopted?: boolean;
  isActive?: boolean;
  dateAdded: string;
}

export interface CreatePetData {
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  avatarURL: string;
  shelterID: string;
  adoptionFee: number;
  breedID: string;
  speciesID: string;
  neutered: boolean;
  vaccinated: boolean;
  trained: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
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
