// barber.ts
export interface Barber {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export let barbers: Barber[] = [];

let currentId = 1;

export function getNextId() {
  return currentId++;
}
