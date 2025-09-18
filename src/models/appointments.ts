export interface Appointment {
  id: number;
  startTime: Date;
  dayOfApp: Date;


export let barbers: Appointment[] = [];

let currentId = 1;

export function getNextId() {
  return currentId;
}
