import { Breed } from "./Breed";
import { Shelter } from "./Shelter";
import { Species } from "./Species";

export interface Pet {
  id?: string;
  name: string;
  species: Species;
  breed: Breed;
  age: number;
  size: 'small' | 'medium' | 'large';
  gender: 'male' | 'female';
  description: string;
  avatarURL: string;
  photos: string[];
  shelter: Shelter;
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
