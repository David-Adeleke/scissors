/**
 * Application Constants
 */

// Limits
export const LIMITS = {
  SLUG_MIN_LENGTH: 3,
  SLUG_MAX_LENGTH: 50,
  URL_MAX_LENGTH: 2048,
  CUSTOM_SLUG_PATTERN: /^[a-zA-Z0-9-]+$/,
  RATE_LIMIT_ANONYMOUS: 5, // 5 links per day
  RATE_LIMIT_WINDOW: 24 * 60 * 60 * 1000, // 24 hours
  MAX_EXPIRY_DAYS: 365,
  MIN_EXPIRY_DAYS: 1,
  CLICK_BATCH_SIZE: 100,
};

// API Configuration
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// QR Code Configuration
export const QR_CODE = {
  DEFAULT_SIZE: 256,
  DEFAULT_COLOR: "#000000",
  DEFAULT_BACKGROUND: "#FFFFFF",
  ERROR_CORRECTION_LEVEL: "H", // L, M, Q, H
  INCLUDE_MARGIN: true,
};

// Colors
export const COLORS = {
  PRIMARY: "#3B82F6",
  SECONDARY: "#8B5CF6",
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  ERROR: "#EF4444",
  INFO: "#3B82F6",
};

// Chart Colors
export const CHART_COLORS = [
  "#3B82F6",
  "#EC4899",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#F87171",
  "#A78BFA",
];

// Device Types
export const DEVICE_TYPES = {
  MOBILE: "mobile",
  TABLET: "tablet",
  DESKTOP: "desktop",
  UNKNOWN: "unknown",
};

// Link Status
export const LINK_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  DRAFT: "draft",
  ARCHIVED: "archived",
};

// Toast Messages
export const TOAST_MESSAGES = {
  LINK_CREATED: "Link created successfully!",
  LINK_DELETED: "Link deleted successfully",
  LINK_COPIED: "Link copied to clipboard",
  QR_DOWNLOADED: "QR code downloaded",
  URL_COPIED: "URL copied to clipboard",
  ERROR_INVALID_URL: "Please enter a valid URL",
  ERROR_SLUG_TAKEN: "This slug is already taken",
  ERROR_SLUG_RESERVED: "This slug is reserved",
  ERROR_RATE_LIMIT: "You've reached the daily limit",
  ERROR_NETWORK: "Network error. Please try again.",
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_URL: "Please enter a valid URL",
  INVALID_SLUG: "Slug must be 3-50 characters with only letters, numbers, and hyphens",
  SLUG_TOO_SHORT: "Slug must be at least 3 characters",
  SLUG_TOO_LONG: "Slug must be at most 50 characters",
  SLUG_TAKEN: "This slug is already taken",
  SLUG_RESERVED: "This slug is reserved",
  URL_TOO_LONG: "URL is too long",
};

// Routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  ANALYTICS: "/analytics",
  LINKS: "/links",
  NOT_FOUND: "/404",
};

// Time Formats
export const TIME_FORMAT = {
  DATE: "MMM dd, yyyy",
  TIME: "HH:mm",
  DATE_TIME: "MMM dd, yyyy HH:mm",
  RELATIVE: true,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Analytics
export const ANALYTICS = {
  UPDATE_INTERVAL: 5000, // 5 seconds
  CHART_HEIGHT: 300,
  MAX_TOP_ITEMS: 10,
};

// UI
export const UI = {
  TRANSITION_DURATION: 300, // ms
  TOAST_DURATION: 3000, // ms
  DEBOUNCE_DELAY: 300, // ms
  ANIMATION_DURATION: "300ms",
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "scissor_user_preferences",
  THEME: "scissor_theme",
  SEARCH_HISTORY: "scissor_search_history",
  LAST_VIEWED_LINK: "scissor_last_viewed_link",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Date Ranges (in days)
export const DATE_RANGES = {
  TODAY: 1,
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_QR_DOWNLOAD: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CUSTOM_DOMAIN: false,
  ENABLE_TEAM_COLLABORATION: false,
  ENABLE_API_ACCESS: false,
  ENABLE_ADVANCED_ANALYTICS: false,
};

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-zA-Z0-9-]+$/,
  PHONE: /^\+?[\d\s\-().]+$/,
};

// Phishing Domain Blocklist
export const PHISHING_DOMAINS = [
  "bit.com",
  "phishing.example.com",
  // Add more as needed
];

// User Agent Patterns
export const USER_AGENT_PATTERNS = {
  MOBILE: /mobile|android|iphone|ipad|windows phone/i,
  TABLET: /tablet|ipad/i,
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 20,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  API_TIMEOUT: 30000,
  QR_SIZE: 256,
  QR_COLOR: "#000000",
  QR_BACKGROUND: "#FFFFFF",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_RESPONSE: "Invalid server response.",
  TIMEOUT: "Request timeout. Please try again.",
  UNAUTHORIZED: "Please sign in to continue.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
  CONFLICT: "This resource already exists.",
  RATE_LIMITED: "Too many requests. Please try again later.",
};
