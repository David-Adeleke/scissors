# Scissor Development Guide

## Getting Started with Development

### Prerequisites
- Node.js 18+
- npm or yarn
- A Convex account
- A Clerk account

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/scissor.git
cd scissor

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Initialize Convex
npm run convex:init
```

## Development Workflow

### 1. Start Development Servers

```bash
# Terminal 1: Convex
npm run dev:convex

# Terminal 2: Frontend
npm run dev:frontend

# Or combined:
npm run dev
```

The app runs on `http://localhost:3000`

### 2. Making Changes

#### Adding a New Field to Links

**convex/schema.ts**
```typescript
export default defineSchema({
  links: defineTable({
    // ... existing fields ...
    newField: v.string(),  // Add new field
  })
});
```

Then push changes:
```bash
npm run convex:push
```

#### Adding a New Mutation

**convex/mutations.ts**
```typescript
export const myNewMutation = mutation({
  args: {
    linkId: v.id("links"),
    data: v.string(),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

#### Using a Mutation in React

**src/components/MyComponent.tsx**
```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MyComponent() {
  const myMutation = useMutation(api.mutations.myNewMutation);
  
  const handleClick = async () => {
    try {
      const result = await myMutation({
        linkId: "...",
        data: "...",
      });
    } catch (err) {
      // Handle error
    }
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

## Code Examples

### Creating a Short Link

```typescript
const { linkId, slug } = await createLink({
  originalUrl: "https://example.com/long-url",
  customSlug: "my-link",           // optional
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,  // 30 days from now
});

// Now you can use the slug
const shortUrl = `https://scs.io/${slug}`;
```

### Checking Slug Availability

```typescript
const result = await checkSlugAvailable({
  slug: "my-custom-slug"
});

if (result.available) {
  // Slug is free to use
} else {
  // Show error based on reason
  if (result.reason === "reserved") {
    // Tell user this slug is reserved
  } else if (result.reason === "taken") {
    // Tell user this slug is already taken
  }
}
```

### Getting User's Links with Analytics

```typescript
// Get all links for current user
const links = await getUserLinks();

// Get detailed analytics for a specific link
const analytics = await getLinkAnalytics({
  linkId: links[0]._id
});

// Access analytics data
console.log(analytics.clicks);           // Array of click events
console.log(analytics.clicksByCountry);  // Aggregated by country
console.log(analytics.clicksByDevice);   // Aggregated by device
console.log(analytics.clicksByReferrer); // Top 10 referrers
console.log(analytics.clicksOverTime);   // Hourly aggregation
```

### Building a Custom Component

**src/components/CustomLinkForm.tsx**
```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

export default function CustomLinkForm() {
  const [url, setUrl] = useState("");
  const createLink = useMutation(api.mutations.createLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await createLink({
        originalUrl: url,
      });
      
      toast.success(`Link created: /${result.slug}`);
      setUrl("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        required
      />
      <button type="submit">Create Link</button>
    </form>
  );
}
```

## Testing Guide

### Unit Tests

Run tests:
```bash
npm test
```

Run with UI:
```bash
npm run test:ui
```

Example unit test:
```typescript
import { describe, it, expect } from "vitest";
import { isValidUrl } from "@/convex/utils";

describe("URL Validation", () => {
  it("should validate correct URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("should reject invalid URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
  });
});
```

### Component Tests

```typescript
import { render, screen } from "@testing-library/react";
import ShortenForm from "@/components/ShortenForm";

describe("ShortenForm", () => {
  it("should render form inputs", () => {
    render(<ShortenForm />);
    expect(screen.getByPlaceholderText("https://example.com")).toBeInTheDocument();
  });
});
```

### E2E Tests

Run E2E tests:
```bash
npm run test:e2e
```

Example E2E test:
```typescript
import { test, expect } from "@playwright/test";

test("should shorten a URL", async ({ page }) => {
  await page.goto("/");
  
  // Fill and submit form
  await page.fill('input[type="url"]', "https://example.com");
  await page.click("button:has-text('Shorten')");
  
  // Verify success
  await expect(page.locator("text=Link created")).toBeVisible();
});
```

## Debugging

### Convex
```bash
# View real-time logs
npm run convex:logs

# Open Convex dashboard
npm run convex:open
```

### React DevTools
Install React DevTools browser extension for debugging components.

### Clerk
```bash
# Test auth locally
# Visit http://localhost:3000 and test sign in/out
```

## Performance Tips

### Frontend
- Use `React.memo` for expensive components
- Lazy load pages with `React.lazy`
- Debounce slug checking queries

### Backend
- Use database indexes for frequent queries
- Aggregate analytics data periodically
- Use scheduled functions for cleanup

## Common Issues and Solutions

### Issue: "Convex API not available"
**Solution**: 
```bash
npm run convex:dev
# Ensure schema is pushed
npm run convex:push
```

### Issue: Clerk authentication not working
**Solution**: 
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is correct
- Check Clerk dashboard for API key
- Clear browser cookies and refresh

### Issue: Slug validation not working
**Solution**:
```typescript
// Add debouncing to avoid excessive queries
import { useCallback, useState } from "react";

const debouncedCheck = useCallback(
  debounce(async (slug) => {
    const result = await checkSlugAvailable({ slug });
    setSlugError(!result.available ? "Taken" : "");
  }, 300),
  []
);
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, test
npm test

# Commit with conventional commits
git commit -m "feat: add awesome feature"

# Push and create PR
git push origin feature/my-feature
```

## Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set in production
- [ ] Convex schema deployed
- [ ] Clerk keys configured

## Additional Resources

- [Convex Documentation](https://docs.convex.dev)
- [React Documentation](https://react.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev)

## Getting Help

- GitHub Issues: [Create an issue](https://github.com/yourusername/scissor/issues)
- Discord: [Join community](https://discord.gg/convex)
- Email: dev@scissor.dev
