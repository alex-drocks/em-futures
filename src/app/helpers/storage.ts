import {getNumber} from "./utils";

function storeSave(key: string, value: any) {
  let parsedValue: string = "";
  if (typeof value === "string") {
    parsedValue = value;
  } else if (typeof value === "number") {
    parsedValue = value.toString();
  } else if (value instanceof Date) {
    parsedValue = value.toISOString();
  }
  window.localStorage.setItem(key, parsedValue);
}

function storeLoad(key: string): string | null {
  return window.localStorage.getItem(key) ?? null;
}

function storeDelete(key: string): void {
  window.localStorage.removeItem(key);
}

function storeLoadDate(key: string, fallback?: Date): Date {
  const storedValue = storeLoad(key);
  return storedValue ? new Date(storedValue) : fallback || new Date();
}

function storeLoadNumber(key: string, fallback?: number): number {
  const storedValue = storeLoad(key);
  return getNumber(storedValue, fallback);
}

function storeLoadString(key: string, fallback?: string): string {
  const storedValue = storeLoad(key);
  return storedValue ? storedValue : fallback || "";
}

export {storeSave, storeDelete, storeLoadDate, storeLoadNumber, storeLoadString}
