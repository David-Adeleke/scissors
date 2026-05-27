import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Convex
vi.mock("convex/react", () => ({
  ConvexProvider: ({ children }: any) => children,
  ConvexReactClient: vi.fn(),
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

// Mock Clerk
vi.mock("@clerk/react", () => ({
  ClerkProvider: ({ children }: any) => children,
  useAuth: vi.fn(() => ({
    isSignedIn: true,
    user: { id: "user-123" },
  })),
}));

import { vi } from "vitest";
