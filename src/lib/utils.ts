import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Claude sometimes wraps JSON output in a markdown code fence despite
// being told not to. Strip it before JSON.parse.
export function stripJsonFences(text: string): string {
  return text.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
}
