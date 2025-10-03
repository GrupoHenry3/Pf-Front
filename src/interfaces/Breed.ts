import { Species } from "./Species";

export interface Breed {
  id?: string;
  name: string;
  description: string;
  avatarURL: string;
  species: Pick<Species, "id">;
}   
