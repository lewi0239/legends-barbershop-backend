export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
export let clients: Client[] = [];

let currentId = 1;

export function getNextId() {
  return currentId++;
}
