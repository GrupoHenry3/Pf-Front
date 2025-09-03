import { Animal } from "./Animal";
import { Organization } from "./Organization";
import { User } from "./User";

export interface Adoption {
  id: number;
  userId: User;
  organizationId: Organization;
  animalId: Animal;
  adoptionDate: Date;
  status: string;
}
