import { Credential } from "./Credential";

export interface Organization {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  website?: string;
  description?: string;
  credentialId?: Credential;
  AdoptionFee: number;
}