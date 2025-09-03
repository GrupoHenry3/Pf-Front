import { Credential } from "./Credential";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  credentialId?: Credential;
}