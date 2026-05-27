import { describe, it, expect } from "vitest";
import {
  isValidUrl,
  isPhishingUrl,
  isValidCustomSlug,
  isReservedSlug,
  parseDeviceType,
  generateSlug,
} from "@/../../convex/utils";

describe("URL Validation", () => {
  it("should validate correct URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://example.com/path?query=value")).toBe(true);
  });

  it("should reject invalid URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("ftp://example.com")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });

  it("should detect phishing URLs", () => {
    expect(isPhishingUrl("https://bit.com/malicious")).toBe(true);
    expect(isPhishingUrl("https://example.com")).toBe(false);
  });
});

describe("Custom Slug Validation", () => {
  it("should validate correct custom slugs", () => {
    expect(isValidCustomSlug("my-slug")).toBe(true);
    expect(isValidCustomSlug("MySlug123")).toBe(true);
    expect(isValidCustomSlug("a-b-c-d")).toBe(true);
  });

  it("should reject invalid custom slugs", () => {
    expect(isValidCustomSlug("ab")).toBe(false); // Too short
    expect(isValidCustomSlug("a".repeat(51))).toBe(false); // Too long
    expect(isValidCustomSlug("my slug")).toBe(false); // Contains space
    expect(isValidCustomSlug("my@slug")).toBe(false); // Invalid character
  });
});

describe("Reserved Slugs", () => {
  it("should identify reserved slugs", () => {
    expect(isReservedSlug("api")).toBe(true);
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("dashboard")).toBe(true);
    expect(isReservedSlug("API")).toBe(true); // Case insensitive
  });

  it("should allow non-reserved slugs", () => {
    expect(isReservedSlug("my-link")).toBe(false);
    expect(isReservedSlug("campaign-2024")).toBe(false);
  });
});

describe("Device Type Parsing", () => {
  it("should identify mobile devices", () => {
    const mobileUA =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";
    expect(parseDeviceType(mobileUA)).toBe("mobile");

    const androidUA =
      "Mozilla/5.0 (Linux; Android 11; SM-G991B)";
    expect(parseDeviceType(androidUA)).toBe("mobile");
  });

  it("should identify tablets", () => {
    const tabletUA =
      "Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X)";
    expect(parseDeviceType(tabletUA)).toBe("tablet");
  });

  it("should identify desktop devices", () => {
    const desktopUA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    expect(parseDeviceType(desktopUA)).toBe("desktop");
  });
});

describe("Slug Generation", () => {
  it("should generate 6-character slugs", () => {
    const slug = generateSlug();
    expect(slug).toHaveLength(6);
  });

  it("should generate unique slugs", () => {
    const slugs = new Set();
    for (let i = 0; i < 100; i++) {
      slugs.add(generateSlug());
    }
    expect(slugs.size).toBe(100);
  });

  it("should use only alphanumeric characters", () => {
    for (let i = 0; i < 50; i++) {
      const slug = generateSlug();
      expect(/^[a-zA-Z0-9_-]+$/.test(slug)).toBe(true);
    }
  });
});
