 import { Breed } from "./Breed";
 export interface Animal {
    id: number,
    name: string,
    age: number,
    breed: Breed,
    gender: string,
    image: string,
    description: string,
    adopted: boolean,
}

