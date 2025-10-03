import type { UserInterface } from "./User";
import type { Pet } from "./Pet";

export interface ApplicationData {
  dni: string;
  birthDate: string;
  adoptionReason: string;
  expectations: string;
  petExperience: string;
  housingType: 'house' | 'apartment' | 'farm' | '';
  housingOwnership: 'own' | 'rent' | '';
  yardSize: 'none' | 'small' | 'medium' | 'large' | '';
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

export interface AdoptionApplicationProps {
  user: UserInterface;
  pet: Pet;
  onBack: () => void;
  onSubmit: (applicationData: ApplicationData) => void;
}
