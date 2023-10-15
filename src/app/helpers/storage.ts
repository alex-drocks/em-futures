import {MomentDateAdapter} from "@angular/material-moment-adapter";

function localStorageSave(key: string, value: any) {
  let parsedValue: string = "";
  if (typeof value === "string") {
    parsedValue = value;
  } else if (typeof value === "number") {
    parsedValue = value.toString();
  } else if (value instanceof Date) {
    console.log("instance of date")
    parsedValue = value.toISOString();
  }
  window.localStorage.setItem(key, parsedValue);
}

function localStorageLoad(key: string): string | null {
  return window.localStorage.getItem(key) ?? null;
}

function localStorageDelete(key: string): void {
  window.localStorage.removeItem(key);
}

function localStorageLoadDate(key: string): Date {
  const storedValue = localStorageLoad(key);
  return storedValue ? new Date(storedValue) : new Date();
}

function localStorageLoadNumber(key: string): number {
  const storedValue = localStorageLoad(key);
  return storedValue ? Number(storedValue) : 0;
}

export {localStorageSave, localStorageDelete, localStorageLoadDate, localStorageLoadNumber}
