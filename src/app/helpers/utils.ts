import {nanoid} from 'nanoid';


function generateId(): string {
  return nanoid();
}

function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

function getNumber(value: string | number | null, fallback?: number): number {
  if (value === null) {
    return fallback || 0;
  }
  const numberValue = Number(value);
  return !isNaN(numberValue) ? numberValue : fallback || 0;
}

export {generateId, round, getNumber};

