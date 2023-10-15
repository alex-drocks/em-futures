import {nanoid} from 'nanoid';


function generateId(): string {
  return nanoid();
}

function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}


export {generateId, round};

