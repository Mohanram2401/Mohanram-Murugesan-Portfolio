import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1]!.toUpperCase());
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCaseKeys<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseKeys) as unknown as T;
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    const n: any = {};
    for (const [k, v] of Object.entries(obj)) {
      n[snakeToCamel(k)] = toCamelCaseKeys(v);
    }
    return n;
  }
  return obj;
}

export function toSnakeCaseKeys<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCaseKeys) as unknown as T;
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    const n: any = {};
    for (const [k, v] of Object.entries(obj)) {
      n[camelToSnake(k)] = toSnakeCaseKeys(v);
    }
    return n;
  }
  return obj;
}

