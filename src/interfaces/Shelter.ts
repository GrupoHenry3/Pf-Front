import { Credential } from "./Credential";

export interface Shelter {
  id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  website?: string;
  description?: string;
  credentialId?: Credential;
  country: string;
  state: string;
  city: string;
}
