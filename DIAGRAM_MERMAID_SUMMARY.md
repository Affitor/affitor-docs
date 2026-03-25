# Diagram Update Summary - Mermaid Version

## Completed - Ultra-Simple Mermaid Diagrams

All diagrams have been converted to **Mermaid flowcharts** - a code-based diagramming syntax that renders directly in markdown. This approach is:

✅ **Simpler** - Plain text, no image files to manage  
✅ **More maintainable** - Edit diagrams by changing code  
✅ **Cleaner** - Minimal, technical documentation style  
✅ **Responsive** - Automatically adapts to screen size  
✅ **Accessible** - Better for screen readers and dark mode  

---

## All Diagrams Converted

### 1. Main User Journey (7-Step Affiliate Lifecycle)
**File**: `/src/content/docs/getting-started/how-it-works.mdx`

```mermaid
graph LR
    A[1. Advertiser Creates Program] --> B[2. Partner Joins & Gets Link]
    B --> C[3. Partner Promotes]
    C --> D[4. Customer Clicks & Visits]
    D --> E[5. Customer Converts & Pays]
    E --> F[6. Commission Calculated]
    F --> G[7. Partner Gets Paid]
```

✅ **Status**: Simple horizontal flow with numbered steps

---

### 2. Affitor Pay Flow
**File**: `/src/content/docs/advertisers/quickstart/commission-approval-cash-flow.mdx`

```mermaid
graph TD
    A[Customer Purchases] -->|Affitor checkout| B[Affitor Collects $100]
    B --> C[Validate Transaction]
    C --> D[Review in Dashboard]
    D -->|7-21 days| E[Hold Period]
    E --> F[Calculate: $100 - $30 commission - $3.50 fee = $66.50]
    F --> G[You receive $66.50]
    F --> H[Partner gets $30]
```

✅ **Status**: Vertical flow with fee calculations

---

### 3. Bill Flow
**File**: `/src/content/docs/advertisers/quickstart/commission-approval-cash-flow.mdx`

```mermaid
graph TD
    A[Customer Purchases] -->|Your checkout| B[You Receive $100]
    B --> C[Affitor Tracks Conversion]
    C --> D[You Approve Transaction]
    D --> E[Affitor Sends Invoice: $33.50]
    E --> F[You Pay $33.50]
    F -->|14 days| G[Hold Period]
    G --> H[Commission Cleared]
    H --> I[Partner Withdraws $30]
```

✅ **Status**: 9-step invoice flow

---

### 4. Split Pay Flow (Coming Soon)
**File**: `/src/content/docs/advertisers/quickstart/commission-approval-cash-flow.mdx`

```mermaid
graph TD
    A[Customer Purchases] -->|Your Stripe checkout| B[Stripe Automatic Split]
    B --> C[You Receive $66.50]
    B --> D[Affitor Receives $33.50]
    C --> E[Validate Transaction]
    D --> E
    E -->|7-21 days| F[Hold Period]
    F --> G[Partner Gets $30]
    
    style B fill:#e1f5ff
```

✅ **Status**: Fork diagram showing parallel fund splitting

---

### 5. Payout Lifecycle
**File**: `/src/content/docs/advertisers/quickstart/payouts.mdx`

```mermaid
graph LR
    A[Sale Happens] --> B[Invoice Sent]
    B --> C[Funds to Affitor]
    C -->|7-21 days| D[Hold Period Clears]
    D --> E[Partner Payout]
```

✅ **Status**: Simple horizontal 5-step flow

---

### 6. Tracking Lifecycle
**File**: `/src/content/docs/advertisers/tracking/tracking-overview.mdx`

```mermaid
graph LR
    A[Partner Shares Link] --> B[Customer Clicks]
    B --> C[Visits Site]
    C --> D[Signs Up]
    D --> E[Purchases]
    
    A -.->|Unique ?aff= URL| A1[Unique link]
    B -.->|Cookie set| B1[Click tracked]
    C -.->|30 day cookie| C1[Cookie persists]
    D -.->|trackLead called| D1[Lead tracked]
    E -.->|Stripe metadata| E1[Sale tracked]
```

✅ **Status**: Dual-track flow with technical annotations (dotted lines)

---

### 7. Complete Payment Flow
**File**: `/src/content/docs/advertisers/tracking/payment-flow.mdx`

```mermaid
graph TD
    A[1. Partner Shares Link] --> B[2. Customer Clicks]
    B --> C[3. Customer Browses]
    C --> D[4. Customer Signs Up]
    D --> E[5. Customer Purchases]
    E --> F[6. Webhook Fires]
    F --> G[7. Commission Calculated]
    G --> H[8. Transaction Validated]
    H --> I[9. Hold Period]
    I --> J[10. Partner Payout]
```

✅ **Status**: 10-step numbered vertical flow

---

## Mermaid Syntax Benefits

### Easy to Edit
Just edit the text to change the diagram:
```mermaid
A[Step 1] --> B[Step 2]
```

### Supports Different Styles
- `-->` = Solid arrow
- `-.->` = Dotted arrow (for annotations)
- `-->|label|` = Arrow with label
- `style X fill:#color` = Color individual nodes

### Automatic Rendering
Mermaid diagrams render automatically in:
- GitHub
- GitLab
- Astro/Starlight documentation
- Markdown preview tools
- Most modern documentation platforms

---

## Files Modified

1. ✅ `/src/content/docs/getting-started/how-it-works.mdx`
2. ✅ `/src/content/docs/advertisers/quickstart/commission-approval-cash-flow.mdx` (3 diagrams)
3. ✅ `/src/content/docs/advertisers/quickstart/payouts.mdx`
4. ✅ `/src/content/docs/advertisers/tracking/tracking-overview.mdx`
5. ✅ `/src/content/docs/advertisers/tracking/payment-flow.mdx`

---

## Next Steps (Optional)

### If Mermaid doesn't render in your setup:
1. Check if Starlight has Mermaid support enabled
2. Install Mermaid plugin if needed: `npm install remark-mermaidjs`
3. Or keep the PNG images in `/public/images/` as fallback

### To customize diagram styling:
1. Edit the Mermaid code directly in the `.mdx` files
2. Add colors: `style NodeName fill:#hexcolor`
3. Change arrow types: `--->` (thick), `==>` (thick with arrow), etc.

---

**Date**: 2026-01-23  
**Status**: Complete - All diagrams converted to Mermaid ✅  
**Advantage**: Code-based, maintainable, simpler, no image quota issues
