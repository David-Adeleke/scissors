# Scissor - URL Shortener

Fast, minimal URL shortener with custom slugs, QR code generation, and real-time click analytics. Built with React, TypeScript, Convex, and Clerk.

![Scissor Banner](https://img.shields.io/badge/URL%20Shortener-Scissor-blue)

## ✨ Features

- **⚡ Lightning Fast** - Generate short links in under 1 second
- **🔗 Custom Slugs** - Create branded, memorable short URLs with real-time availability checking
- **📱 QR Codes** - Generate beautiful QR codes (SVG & PNG) with customizable colors
- **📊 Real-Time Analytics** - Track clicks with country, device, and referrer data
- **🔐 Secure** - Built-in phishing detection and URL validation
- **⏰ Link Expiration** - Set optional expiry dates for links
- **🎯 Rate Limiting** - Protect against spam with intelligent rate limiting
- **🌍 Global Ready** - Multi-language support ready, Cloudflare integration

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for analytics visualization
- **Clerk** for authentication
- **Convex React** for real-time data

### Backend
- **Convex** - Real-time database with type-safe mutations
- **Clerk Integration** - Secure authentication
- **nanoid** - Collision-safe slug generation
- **Vercel Edge Functions** - Redirect handling (optional)

### Testing
- **Vitest** - Unit and component tests
- **Playwright** - E2E tests
- **React Testing Library** - Component testing

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Convex account
- Clerk account (for auth)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/scissor.git
cd scissor
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials:
```env
VITE_CONVEX_URL=your_convex_url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### 3. Initialize Convex

```bash
npm run convex:init
# Follow prompts to create a new Convex project
```

### 4. Deploy Convex Schema

```bash
npm run convex:push
```

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📚 Project Structure

```
scissor/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Navigation & header
│   │   ├── ShortenForm.tsx      # URL shortening form
│   │   ├── QRCodeDisplay.tsx    # QR code generation
│   │   ├── AnalyticsDashboard.tsx
│   │   └── LinksTable.tsx       # Links management
│   ├── pages/
│   │   ├── Landing.tsx          # Landing page
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   └── Redirect.tsx         # Redirect handling
│   ├── test/
│   │   ├── unit.test.ts         # Utility tests
│   │   └── components.test.tsx   # Component tests
│   ├── e2e/
│   │   └── app.spec.ts          # E2E tests
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── convex/
│   ├── schema.ts                # Database schema
│   ├── mutations.ts             # Create/read/delete operations
│   ├── utils.ts                 # Validation & parsing
│   ├── http.ts                  # Redirect HTTP handler
│   └── auth.ts                  # Clerk integration
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

## 🔧 Core Features Implementation

### URL Shortening

```typescript
// Create a short link
const { linkId, slug } = await createLink({
  originalUrl: "https://example.com/very/long/url",
  customSlug: "my-brand",  // optional
  expiresAt: 1234567890,   // optional
});
```

### Custom Slug Validation

- 3-50 characters
- Alphanumeric + hyphens only
- Real-time availability checking
- Reserved slug protection

### QR Code Generation

```typescript
<QRCode
  value={shortUrl}
  size={256}
  fgColor={customColor}
  bgColor={backgroundColor}
/>
```

Download as SVG or PNG with a single click.

### Click Analytics

Track real-time:
- Total clicks
- Geographic distribution (country)
- Device type (mobile, tablet, desktop)
- HTTP referrers
- Clicks over time (hourly aggregation)

### Link Expiration

- Set optional expiry date at creation
- Automatic expiry enforcement via scheduled functions
- Returns HTTP 410 Gone for expired links
- Branded expiry page

### Rate Limiting

- 5 links per day for anonymous users
- Uses IP address + timestamp buckets
- 24-hour reset window
- Configurable limits

## 🧪 Testing

### Unit Tests

```bash
npm test unit.test.ts
```

Tests for:
- URL validation
- Slug generation & collision detection
- Custom slug validation
- Reserved slug checking
- Device type parsing

### Component Tests

```bash
npm test components.test.tsx
```

Tests for:
- ShortenForm rendering and submission
- QRCodeDisplay download functionality
- AnalyticsDashboard charts
- LinksTable operations

### E2E Tests

```bash
npm run test:e2e
```

Tests for:
- Complete URL shortening flow
- Custom slug collision detection
- QR code download
- Redirect functionality
- Link deletion
- Analytics display
- Link expiration
- Rate limiting

## 📊 Database Schema

### links
- `userId` - Owner of the link
- `originalUrl` - Full URL to redirect to
- `slug` - Unique short slug
- `customSlug` - User-provided slug (optional)
- `clicks` - Click counter
- `createdAt` - Creation timestamp
- `expiresAt` - Optional expiry timestamp
- `isExpired` - Expiration flag
- `qrColor` - QR code foreground color
- `qrBackgroundColor` - QR code background color

### clicks
- `linkId` - Reference to link
- `timestamp` - When click happened
- `referrer` - HTTP referrer
- `country` - Country from header
- `deviceType` - Device classification
- `userAgent` - Full UA string
- `ipAddress` - IP address

### rateLimitBuckets
- `ipAddress` - IP being rate limited
- `count` - Number of links created
- `resetAt` - When bucket resets

## 🔐 Security Features

- **URL Validation** - Rejects malformed URLs
- **Phishing Detection** - Blocklist of known phishing domains
- **HTTPS Only** - Only http:// and https:// protocols allowed
- **Clerk Integration** - Secure user authentication
- **Rate Limiting** - Prevents abuse
- **CORS Protection** - Proper CORS headers
- **302 Redirects** - Avoids browser caching for accurate analytics

## 📈 Scalability

### Database Indexes
- `by_slug` - Fast slug lookups
- `by_userId` - User's links
- `by_expiresAt` - Expiration processing
- `by_linkId_timestamp` - Analytics aggregation

### Optimization
- Reactive queries - Real-time updates without polling
- Aggregation functions - Pre-computed analytics
- Scheduled functions - Automatic expiry cleanup
- Edge functions - Fast redirects globally

## 🚀 Deployment

### Vercel + Convex

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

```bash
npm run build
npm run preview
```

### Docker (Optional)

```bash
docker build -t scissor .
docker run -p 3000:3000 scissor
```

## 📝 API Reference

### Mutations

#### createLink
Creates a new shortened link.

```typescript
await createLink({
  originalUrl: string,
  customSlug?: string,
  expiresAt?: number,
  qrColor?: string,
  qrBackgroundColor?: string,
})
```

#### recordClick
Records a click event (called by HTTP redirect handler).

```typescript
await recordClick({
  slug: string,
  referrer?: string,
  userAgent?: string,
  country?: string,
  ipAddress?: string,
})
```

#### deleteLink
Deletes a link and all associated clicks.

```typescript
await deleteLink({
  linkId: Id<"links">,
})
```

### Queries

#### getUserLinks
Gets all links for the authenticated user.

#### getLinkAnalytics
Gets detailed analytics for a specific link.

```typescript
await getLinkAnalytics({
  linkId: Id<"links">,
})
```

#### checkSlugAvailable
Checks if a custom slug is available.

```typescript
await checkSlugAvailable({
  slug: string,
})
```

## 🌐 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Your Convex deployment URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `VITE_SHORT_DOMAIN` | Custom short domain (scs.io, etc) |
| `VITE_API_URL` | API endpoint |

## 📦 Dependencies

### Production
- react@18.3.1
- react-dom@18.3.1
- convex@1.14.1
- @clerk/convex@1.0.0
- nanoid@5.0.4
- qrcode.react@1.0.1
- recharts@2.12.0
- tailwindcss@3.4.1

### Dev
- vitest@1.1.0
- @playwright/test@1.40.1
- vite@5.0.8
- typescript@5.3.3

## 🐛 Troubleshooting

### "Convex not connected"
- Check `VITE_CONVEX_URL` is correct
- Run `convex dev` to sync schema

### "Rate limit exceeded"
- Wait 24 hours or clear IP cache
- Adjust `RATE_LIMIT_COUNT` in mutations

### "Slug already taken"
- Custom slug is taken
- Try a different slug or let system generate one

## 📄 License

MIT License - see LICENSE file

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Add tests
4. Submit a pull request

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/yourusername/scissor/issues)
- Documentation: [Read docs](https://docs.scissor.dev)
- Email: support@scissor.dev

---

**Made with ❤️ using Convex, React, and TypeScript**
# scissors
