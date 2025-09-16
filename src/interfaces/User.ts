import { Credential } from "./Credential";
import { Pet } from "./Pet";


export interface UserInterface {
  id?: string;
  fullName?: string;
  email: string;
  password?: string;
  role: "adopter" | "shelter" | "admin";
  googleID?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  address?: string;
  avatarURL?: string;
  userType: string;
  siteAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  adoptions?: [];
  favoritePets?: Pet[];
}
