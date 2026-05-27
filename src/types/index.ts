// Database types
export interface Link {
  _id: string;
  userId: string;
  originalUrl: string;
  slug: string;
  customSlug?: string;
  clicks: number;
  createdAt: number;
  expiresAt?: number;
  isExpired: boolean;
  qrColor: string;
  qrBackgroundColor: string;
}

export interface Click {
  _id: string;
  linkId: string;
  timestamp: number;
  referrer?: string;
  country?: string;
  deviceType?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface RateLimitBucket {
  _id: string;
  ipAddress: string;
  count: number;
  resetAt: number;
}

// API Response types
export interface CreateLinkResponse {
  linkId: string;
  slug: string;
}

export interface RecordClickResponse {
  originalUrl: string;
}

export interface CheckSlugResponse {
  available: boolean;
  reason?: "reserved" | "taken";
}

// Analytics types
export interface ClickAggregate {
  name: string;
  value: number;
}

export interface ClickOverTime {
  time: string;
  value: number;
}

export interface LinkAnalytics {
  link: Link;
  clicks: Click[];
  clicksByCountry: ClickAggregate[];
  clicksByDevice: ClickAggregate[];
  clicksByReferrer: ClickAggregate[];
  clicksOverTime: ClickOverTime[];
}

// UI types
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Form types
export interface ShortenFormData {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: number;
  qrColor?: string;
  qrBackgroundColor?: string;
}

export interface FilterOptions {
  searchTerm?: string;
  status?: "all" | "active" | "expired";
  dateRange?: {
    start: number;
    end: number;
  };
}

// Pagination types
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationState;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: number;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

// Feature flags
export interface FeatureFlags {
  enableQRDownload: boolean;
  enableAnalytics: boolean;
  enableCustomDomain: boolean;
  enableTeamCollaboration: boolean;
  enableAPIAccess: boolean;
}

// Settings
export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "auto";
  emailNotifications: boolean;
  analyticsOptIn: boolean;
  defaultLinkExpiry?: number;
  defaultQRColor?: string;
  defaultQRBackground?: string;
  createdAt: number;
  updatedAt: number;
}

// Audit log
export interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  timestamp: number;
  ipAddress?: string;
}
