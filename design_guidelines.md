# TaskGrid Design Guidelines

## Design Approach
**Reference-Based Web3 Marketplace**
- Primary inspiration: Polygon's brand identity (purple accent), Upwork's marketplace patterns, Linear's modern minimalism
- Web3-native aesthetic: clean, trustworthy, tech-forward with subtle futuristic elements
- Key principle: Professional marketplace meets cutting-edge blockchain technology

## Typography
**Font Stack:**
- Primary: Inter (400, 500, 600, 700) - body text, UI elements
- Accent: Space Grotesk (600, 700) - headings, hero section, blockchain-specific callouts

**Hierarchy:**
- Hero headline: 4xl-6xl, Space Grotesk 700
- Section headers: 3xl-4xl, Space Grotesk 600
- Card titles: xl-2xl, Inter 600
- Body text: base-lg, Inter 400
- Metadata/labels: sm-base, Inter 500

## Layout System
**Spacing Primitives:** Tailwind units 2, 4, 6, 8, 12, 16, 20, 24
- Card padding: p-6 to p-8
- Section vertical spacing: py-16 to py-24
- Component gaps: gap-4 to gap-8
- Container max-width: max-w-7xl

**Grid Patterns:**
- Job cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard widgets: grid-cols-1 md:grid-cols-2 xl:grid-cols-4
- Application cards: Single column with rich detail

## Component Library

**Navigation:**
- Fixed top navbar with backdrop blur, border-b
- Logo left, primary actions right (Find Work, Post Job, Dashboard, Connect Wallet button)
- Wallet connection shows truncated address with avatar when connected
- Mobile: Slide-out menu with full navigation stack

**Hero Section (Homepage):**
- Full-width container with gradient background treatment
- H1: "Decentralized Freelancing. Fair, Fast, and Borderless."
- Prominent subheading: "Built on Polygon - Zero fees, instant payments, verified reputation"
- Three CTA buttons in flex row: "Start as Freelancer" (primary purple), "Post a Job" (secondary), "Explore Jobs" (outline)
- Stats bar below CTAs: "X Active Jobs | Y Freelancers | Z Total Earned" in grid-cols-3

**Cards (Job Listings, Profiles):**
- Rounded-xl borders with subtle shadow
- Header: Title + budget badge (purple bg, white text)
- Body: Description preview, skill tags (pill-shaped, sm size)
- Footer: Metadata row (deadline, client reputation, applicant count)
- Hover: Subtle lift with shadow increase, no scale

**Form Components:**
- Input fields: Consistent border, rounded-lg, focus ring in purple
- File upload: Dashed border dropzone with icon and helper text
- Budget input: Special treatment with USDC/MATIC selector toggle
- Date picker: Calendar popup, purple accent for selected dates
- Multi-select skills: Tag input with removable chips

**Transaction Modals:**
- Centered modal with backdrop blur
- Clear hierarchy: Icon (wallet/checkmark) > Title > Amount display > Gas estimate
- Two-button layout: Cancel (outline) + Confirm (solid purple)
- Loading state: Spinner with "Confirming on Polygon..." text
- Success state: Checkmark animation with transaction hash link

**Dashboard Widgets:**
- Stat cards: Large number display (3xl) + label + trend indicator
- Recent activity feed: Timeline layout with icons for different events
- Active contracts: Compact card list with progress indicators
- NFT showcase: Grid of achievement badges with metadata on hover

**NFT Proof-of-Work Display:**
- Card with gradient border (purple to blue)
- Certificate-style layout: Job title, rating stars, amount earned
- Bottom metadata: Client address (truncated), completion date
- "View on PolygonScan" link with external icon

**Chat Interface:**
- Split panel: Message list left, conversation right
- Messages: Bubbles with wallet avatar, timestamp below
- Input: Fixed bottom with file attach button, send arrow
- Status indicators: "Encrypted on-chain" badge visible

**Dispute Resolution:**
- Two-column layout: Evidence upload left, AI recommendation right
- Evidence cards: File preview with IPFS hash reference
- Decision panel: Clear winner indicator with reasoning summary
- Action buttons: Only available to authorized resolvers

**Profile Pages:**
- Cover area with wallet address and verification badge
- Tab navigation: Overview, Work NFTs, Reviews, Skills
- Reputation score: Large circular progress indicator (0-100)
- NFT grid: 3-column masonry with hover expand

## Images

**Homepage Hero:**
Large hero image showing abstract visualization of decentralized network/connections with purple-blue gradient overlay. People collaborating remotely, tech-forward aesthetic. Image spans full width, text overlaid with dark gradient scrim for readability. Suggested size: 1920x800px.

**Job Categories:**
Icon-based visual cards for each category (Design, Development, Writing, etc.) with subtle background patterns. No photographic images needed - use illustrative icons from Heroicons.

**Empty States:**
Friendly illustrations for "No active jobs," "No applications yet," "NFT collection empty" - minimalist line art style, purple accent.

**Profile Headers:**
Optional user-uploaded cover images (1200x300px), default to purple gradient if none provided.

## Special Considerations

**Web3 Elements:**
- Wallet connection status always visible (top-right badge)
- Transaction confirmations use toast notifications (bottom-right)
- Gas estimates shown before all blockchain interactions
- Polygon logo watermark in footer with "Powered by Polygon PoS"

**Trust Indicators:**
- Verification badges (checkmark in purple circle) for completed profiles
- Escrow status banner (green = funded, yellow = pending, red = disputed)
- Star ratings prominently displayed (gold stars, 5-point scale)

**Responsive Breakpoints:**
- Mobile: Stack all multi-column layouts, expand touch targets to 48px minimum
- Tablet: 2-column max for cards, maintain full navigation
- Desktop: Full feature set, optimal 1440px viewport

**Accessibility:**
- All interactive elements have focus states (purple ring)
- Consistent color contrast ratios (WCAG AA minimum)
- Form labels always visible, no placeholder-only inputs
- Wallet addresses show full text on hover tooltip