import { Shelter } from "./Shelter";
import { UserInterface } from "./User";

export interface Donation {
    
    id: string,
    message: string,
    sessionID: string,
    user: UserInterface,
    shelter: Shelter,
    status: "completed" | "pending" | "failed" | "expired",
    failureReason?: string,
    createdAt: string,
    updatedAt: string
    amount: number,
}