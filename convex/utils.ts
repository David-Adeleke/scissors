import { nanoid } from "nanoid";

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Phishing domain blocklist (can be extended)
const PHISHING_DOMAINS = [
  "bit.com",
  "phishing.example.com",
  // Add more as needed
];

export function isPhishingUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return PHISHING_DOMAINS.some(
      (domain) =>
        parsed.hostname === domain || parsed.hostname?.endsWith("." + domain)
    );
  } catch {
    return false;
  }
}

// Generate collision-safe slug
export function generateSlug(): string {
  return nanoid(6);
}

// Validate custom slug format
export function isValidCustomSlug(slug: string): boolean {
  if (slug.length < 3 || slug.length > 50) return false;
  return /^[a-zA-Z0-9-]+$/.test(slug);
}

// Reserved slugs that cannot be used
export const RESERVED_SLUGS = [
  "api",
  "admin",
  "dashboard",
  "login",
  "signup",
  "settings",
  "profile",
  "help",
  "docs",
  "about",
  "contact",
  "terms",
  "privacy",
  "health",
  "status",
  "cdn",
  "static",
  "assets",
  "images",
  "js",
  "css",
];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}

// Parse user agent for device type
export function parseDeviceType(userAgent: string): string {
  if (/mobile|android|iphone|ipad|windows phone/i.test(userAgent)) {
    return "mobile";
  }
  if (/tablet|ipad/i.test(userAgent)) {
    return "tablet";
  }
  return "desktop";
}
