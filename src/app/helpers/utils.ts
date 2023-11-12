import {nanoid} from 'nanoid';


function generateId(): string {
  return nanoid();
}

function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

function getNumber(value: any, fallback?: number): number {
  if (value === null || value === undefined) {
    return fallback || 0;
  }
  const numberValue = Number(value);
  return !isNaN(numberValue) ? numberValue : fallback || 0;
}

function getDate(value: any, fallback?: Date): Date {
  if (!value) {
    return fallback ?? new Date();
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? (fallback ?? new Date()) : date;
}

export {generateId, round, getNumber, getDate};

