import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { supabase } from "../supabaseClient";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isTrustedImageUrl(value) {
  const allowedPrefix = `${supabase.supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/`;
  return typeof value === "string" && value.startsWith(allowedPrefix);
}
