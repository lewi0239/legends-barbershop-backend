export interface Item {
  id: number;
  name: string;
}

export let items: Item[] = [];

let currentId = 1;

export function getNextId() {
  return currentId++;
}
