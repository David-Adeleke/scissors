# Scissor API Documentation

## Overview

Scissor provides a type-safe API via Convex mutations and queries. All endpoints are authenticated via Clerk.

## Base URL

```
https://your-project.convex.cloud
```

## Authentication

All requests require a valid Clerk JWT token. The token is automatically included in requests when using `useMutation` and `useQuery` from `convex/react`.

## Mutations

### createLink

Creates a new shortened URL with optional custom slug and expiration.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| originalUrl | string | ✓ | The URL to shorten (must be valid http/https) |
| customSlug | string | ✗ | Custom slug (3-50 chars, alphanumeric + hyphens) |
| expiresAt | number | ✗ | Unix timestamp when link expires |
| qrColor | string | ✗ | QR code foreground color (hex) |
| qrBackgroundColor | string | ✗ | QR code background color (hex) |

**Returns:**
```typescript
{
  linkId: Id<"links">,
  slug: string
}
```

**Example:**
```typescript
const result = await createLink({
  originalUrl: "https://example.com/very/long/url",
  customSlug: "my-link",
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,  // 30 days
});

console.log(`Short URL: https://scs.io/${result.slug}`);
```

**Error Cases:**
- `"Invalid URL format"` - URL is malformed
- `"URL blocked - suspected phishing domain"` - URL in blocklist
- `"Invalid slug format"` - Slug doesn't match requirements
- `"This slug is reserved"` - Slug is in reserved list
- `"Slug already taken"` - Slug already exists
- `"Rate limit exceeded"` - Too many links created (anonymous users)

---

### recordClick

Records a click event on a shortened link. Called automatically by the redirect handler.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | ✓ | The short slug being clicked |
| referrer | string | ✗ | HTTP referrer header |
| userAgent | string | ✗ | User agent string |
| country | string | ✗ | Country code from headers |
| ipAddress | string | ✗ | IP address |

**Returns:**
```typescript
{
  originalUrl: string
}
```

**Error Cases:**
- `"Link not found"` - Slug doesn't exist
- `"Link expired"` - Link has expired

---

### deleteLink

Permanently deletes a shortened link and all associated click data.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| linkId | Id<"links"> | ✓ | The link ID to delete |

**Returns:**
```typescript
void
```

**Example:**
```typescript
await deleteLink({
  linkId: "k7a9b2c1d4e5f6g7h"
});
```

**Error Cases:**
- `"Not found or unauthorized"` - Link doesn't exist or you don't own it

---

## Queries

### getUserLinks

Gets all shortened links created by the authenticated user.

**Parameters:**
None

**Returns:**
```typescript
Array<{
  _id: Id<"links">,
  userId: string,
  originalUrl: string,
  slug: string,
  customSlug?: string,
  clicks: number,
  createdAt: number,
  expiresAt?: number,
  isExpired: boolean,
  qrColor: string,
  qrBackgroundColor: string,
}>
```

**Example:**
```typescript
const links = await getUserLinks();

links.forEach(link => {
  console.log(`${link.slug}: ${link.originalUrl} (${link.clicks} clicks)`);
});
```

---

### getLinkAnalytics

Gets detailed click analytics for a specific link.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| linkId | Id<"links"> | ✓ | The link to analyze |

**Returns:**
```typescript
{
  link: LinkDocument,
  clicks: Array<ClickEvent>,
  clicksByCountry: Array<{name: string, value: number}>,
  clicksByDevice: Array<{name: string, value: number}>,
  clicksByReferrer: Array<{name: string, value: number}>,
  clicksOverTime: Array<{time: string, value: number}>,
}
```

**Example:**
```typescript
const analytics = await getLinkAnalytics({
  linkId: "k7a9b2c1d4e5f6g7h"
});

console.log(`Total clicks: ${analytics.link.clicks}`);
console.log("Top countries:", analytics.clicksByCountry);
console.log("Device breakdown:", analytics.clicksByDevice);
console.log("Top referrers:", analytics.clicksByReferrer);
```

**Data Structure:**

**ClickEvent:**
```typescript
{
  _id: Id<"clicks">,
  linkId: Id<"links">,
  timestamp: number,        // Unix timestamp
  referrer?: string,        // e.g., "https://twitter.com"
  country?: string,         // e.g., "US", "NG"
  deviceType?: string,      // "mobile" | "tablet" | "desktop"
  userAgent?: string,       // Full UA string
  ipAddress?: string,       // IP address
}
```

---

### checkSlugAvailable

Checks if a custom slug is available for use.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | ✓ | The slug to check |

**Returns:**
```typescript
{
  available: boolean,
  reason?: "reserved" | "taken"
}
```

**Example:**
```typescript
const result = await checkSlugAvailable({
  slug: "my-awesome-link"
});

if (result.available) {
  console.log("Slug is available!");
} else {
  if (result.reason === "reserved") {
    console.log("This slug is reserved");
  } else {
    console.log("This slug is already taken");
  }
}
```

---

## HTTP Endpoints

### Redirect

**GET** `/:slug`

Redirects to the original URL associated with the slug.

**Response:**
- `302 Found` - Redirect to original URL
- `404 Not Found` - Slug doesn't exist
- `410 Gone` - Link has expired

**Example:**
```
GET /my-link HTTP/1.1
Host: scs.io

HTTP/1.1 302 Found
Location: https://example.com/very/long/url
```

### Health Check

**GET** `/health`

Checks if the service is operational.

**Response:**
```json
{
  "status": "ok"
}
```

---

## Error Handling

All mutations return errors as JavaScript exceptions. Handle them with try-catch:

```typescript
try {
  const result = await createLink({
    originalUrl: "https://example.com",
    customSlug: "my-link"
  });
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    
    if (error.message.includes("already taken")) {
      // Show "slug taken" error to user
    } else if (error.message.includes("phishing")) {
      // Show "blocked URL" error
    }
  }
}
```

---

## Rate Limiting

**Anonymous users:** 5 links per 24 hours
**Authenticated users:** Unlimited

Rate limit is tracked by IP address and resets every 24 hours.

---

## Data Types

### Link Document

```typescript
interface Link {
  _id: Id<"links">,
  userId: string,
  originalUrl: string,
  slug: string,
  customSlug?: string,
  clicks: number,
  createdAt: number,
  expiresAt?: number,
  isExpired: boolean,
  qrColor: string,
  qrBackgroundColor: string,
}
```

### Click Event

```typescript
interface ClickEvent {
  _id: Id<"clicks">,
  linkId: Id<"links">,
  timestamp: number,
  referrer?: string,
  country?: string,
  deviceType?: string,
  userAgent?: string,
  ipAddress?: string,
}
```

---

## Usage Examples

### Complete Flow: Create, Share, and Analyze

```typescript
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MyApp() {
  const createLink = useMutation(api.mutations.createLink);
  const getUserLinks = useQuery(api.mutations.getUserLinks);
  const getLinkAnalytics = useMutation(api.mutations.getLinkAnalytics);

  // Step 1: Create a short link
  const handleCreateLink = async () => {
    try {
      const result = await createLink({
        originalUrl: "https://my-long-url.example.com/page",
        customSlug: "campaign-2024",
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      console.log(`Short URL: https://scs.io/${result.slug}`);
      return result.slug;
    } catch (error) {
      console.error("Failed to create link:", error.message);
    }
  };

  // Step 2: Get all user's links
  const handleGetLinks = () => {
    if (getUserLinks) {
      return getUserLinks.map(link => ({
        slug: link.slug,
        url: `https://scs.io/${link.slug}`,
        clicks: link.clicks,
        created: new Date(link.createdAt),
      }));
    }
  };

  // Step 3: Analyze a specific link
  const handleAnalyzeLink = async (linkId) => {
    try {
      const analytics = await getLinkAnalytics({
        linkId: linkId as Id<"links">,
      });

      return {
        totalClicks: analytics.link.clicks,
        topCountries: analytics.clicksByCountry.slice(0, 5),
        devices: analytics.clicksByDevice,
        topReferrers: analytics.clicksByReferrer.slice(0, 10),
        timeline: analytics.clicksOverTime,
      };
    } catch (error) {
      console.error("Failed to get analytics:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleCreateLink}>Create Link</button>
      {/* ... rest of UI ... */}
    </div>
  );
}
```

---

## Best Practices

1. **Always validate URLs**
   ```typescript
   const isValidHttpUrl = (string) => {
     try {
       const url = new URL(string);
       return url.protocol === "http:" || url.protocol === "https:";
     } catch (_) {
       return false;
     }
   };
   ```

2. **Debounce slug checking**
   ```typescript
   const debouncedCheck = useCallback(
     debounce(async (slug) => {
       const result = await checkSlugAvailable({ slug });
       setError(!result.available ? "Slug taken" : "");
     }, 300),
     []
   );
   ```

3. **Handle expiration gracefully**
   ```typescript
   const isExpired = (link) => {
     return link.isExpired || (link.expiresAt && link.expiresAt < Date.now());
   };
   ```

4. **Cache analytics data**
   ```typescript
   // Use React Query or similar for caching
   const { data: analytics } = useQuery(
     () => getLinkAnalytics({ linkId }),
     { staleTime: 60000 } // Cache for 1 minute
   );
   ```

---

## Support

- **Documentation:** https://docs.scissor.dev
- **Issues:** https://github.com/yourusername/scissor/issues
- **Email:** api-support@scissor.dev
