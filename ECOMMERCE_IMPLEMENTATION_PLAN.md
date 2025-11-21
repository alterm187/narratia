# E-Commerce Implementation Plan: Ebook Sales on Narratia.pl

**Project**: Direct Ebook Sales System for Sebastian Proba's Books
**Date**: November 20, 2025
**Status**: Planning
**Estimated Timeline**: 3-4 weeks

---

## 🎯 Project Objectives

Enable direct ebook sales on narratia.pl with:
- **Secure Payment Processing**: Accept international payments via Stripe
- **Digital Delivery**: Personalized watermarked PDFs sent automatically
- **Marketing Automation**: Email sequences, abandoned cart recovery, upsells
- **Customer Experience**: Seamless purchase-to-delivery flow
- **Revenue Optimization**: Direct sales = higher margins than distributors

---

## 📚 Products to Sell

Based on your current books catalog:

### Primary Products (Launch Phase)
1. **"Lustra, których nie mamy" / "Mirrors We Don't Have"**
   - Format: EPUB, MOBI, PDF (all 3 in one purchase)
   - Target Price: $9.99 USD / 39 PLN
   - Languages: Polish & English versions

2. **"Laska i kij" / "The Stick and the Carrot"**
   - Format: EPUB, MOBI, PDF
   - Target Price: $9.99 USD / 39 PLN
   - Languages: Polish & English versions

3. **"Odbicie umysłu" / "Mind's Reflection"**
   - Format: EPUB, MOBI, PDF
   - Target Price: $4.99 USD / 19 PLN
   - Language: Polish & English versions

### Future Products (Phase 2)
4. **Bundle: Complete Collection**
   - All 3 books
   - Price: $19.99 USD / 79 PLN (33% discount)

5. **Audiobook versions** (if/when available)

---

## 🏗️ Technical Architecture

### Tech Stack (Reuse from ascendo-analytics)
```
Frontend:     Next.js 16 (already in place)
Payments:     Stripe
Email:        SendGrid (already integrated) + Mailchimp
Watermarking: pdf-lib (for PDFs), custom for EPUB/MOBI
Storage:      /secure directory (outside public)
Database:     SQLite for orders & download tokens
Analytics:    Vercel Analytics + Custom Events
```

### Security Model
```
Purchase Flow:
1. Customer clicks "Buy" → Stripe Checkout
2. Payment Success → Webhook triggers automation
3. Generate watermarked files (PDF/EPUB/MOBI)
4. Create time-limited download token (7 days)
5. Send email with download link
6. Track downloads (max 5 per purchase)
```

---

## 📂 Project Structure

```
/narratia
├── app/
│   ├── api/
│   │   ├── payment/
│   │   │   ├── create-checkout/route.ts       # Create Stripe session
│   │   │   ├── webhook/route.ts               # Process payment events
│   │   │   └── verify/route.ts                # Verify payment status
│   │   ├── download/
│   │   │   └── [token]/route.ts               # Secure download endpoint
│   │   └── products/
│   │       └── route.ts                       # Product catalog API
│   ├── [lang]/
│   │   ├── shop/                              # NEW: Shop pages
│   │   │   ├── page.tsx                       # All ebooks
│   │   │   └── [slug]/page.tsx                # Individual ebook page
│   │   ├── checkout/
│   │   │   ├── success/page.tsx               # Payment success
│   │   │   ├── cancelled/page.tsx             # Payment cancelled
│   │   │   └── expired/page.tsx               # Download link expired
│   │   └── account/                           # Customer portal (Phase 2)
│   │       └── orders/page.tsx                # Order history
│
├── components/
│   ├── shop/
│   │   ├── EbookCard.tsx                      # Product display
│   │   ├── BuyButton.tsx                      # Purchase CTA
│   │   ├── PriceDisplay.tsx                   # Multi-currency pricing
│   │   ├── FormatSelector.tsx                 # Select formats
│   │   └── BundleOffer.tsx                    # Upsell bundles
│   └── checkout/
│       ├── CheckoutForm.tsx                   # Customer info form
│       ├── PaymentSummary.tsx                 # Order review
│       └── DownloadButton.tsx                 # Post-purchase downloads
│
├── lib/
│   ├── stripe/
│   │   ├── client.ts                          # Stripe initialization
│   │   ├── checkout.ts                        # Checkout session helpers
│   │   └── webhooks.ts                        # Webhook handlers
│   ├── ebooks/
│   │   ├── products.ts                        # Product definitions
│   │   ├── watermark-pdf.ts                   # PDF watermarking
│   │   ├── watermark-epub.ts                  # EPUB watermarking
│   │   └── format-conversion.ts               # Format handling
│   ├── downloads/
│   │   ├── tokens.ts                          # Download token CRUD
│   │   ├── security.ts                        # Download limits & expiry
│   │   └── analytics.ts                       # Track download events
│   ├── emails/
│   │   ├── templates/
│   │   │   ├── purchase-confirmation.ts       # Order confirmation
│   │   │   ├── download-ready.ts              # Download link email
│   │   │   ├── abandoned-cart.ts              # Cart recovery
│   │   │   └── review-request.ts              # Post-purchase follow-up
│   │   └── sequences.ts                       # Email automation
│   └── database/
│       ├── schema.sql                         # Database schema
│       ├── orders.ts                          # Order management
│       └── customers.ts                       # Customer data
│
├── content/
│   ├── ebooks/                                # NEW: Ebook source files
│   │   ├── mirrors-we-dont-have/
│   │   │   ├── product.json                   # Product metadata
│   │   │   ├── mirrors-en.epub                # English EPUB
│   │   │   ├── mirrors-en.mobi                # English MOBI
│   │   │   ├── mirrors-en.pdf                 # English PDF
│   │   │   ├── mirrors-pl.epub                # Polish EPUB
│   │   │   ├── mirrors-pl.mobi                # Polish MOBI
│   │   │   └── mirrors-pl.pdf                 # Polish PDF
│   │   ├── stick-and-carrot/
│   │   └── minds-reflection/
│   └── books/                                 # Existing: Book info pages
│
├── secure/                                    # NOT in git
│   └── watermarked/
│       └── {orderId}/
│           ├── {productSlug}-{lang}.pdf
│           ├── {productSlug}-{lang}.epub
│           ├── {productSlug}-{lang}.mobi
│           └── metadata.json
│
└── public/
    └── samples/                               # FREE sample chapters
        ├── mirrors-sample.pdf
        ├── stick-carrot-sample.pdf
        └── minds-reflection-sample.pdf
```

---

## 🔧 Implementation Phases

### **Phase 1: Core E-Commerce Infrastructure (Week 1-2)**

#### Week 1: Payment & Product Foundation

**Day 1-2: Stripe Integration**
```bash
# Install dependencies
npm install stripe @stripe/stripe-js
npm install pdf-lib epub-gen
npm install better-sqlite3 @types/better-sqlite3
```

**Files to Create:**

1. **lib/stripe/client.ts**
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const STRIPE_CONFIG = {
  currency: 'usd', // Primary currency
  successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/{lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/{lang}/checkout/cancelled`,
};
```

2. **lib/ebooks/products.ts**
```typescript
export interface EbookProduct {
  id: string;
  slug: string;
  title: {
    en: string;
    pl: string;
  };
  description: {
    en: string;
    pl: string;
  };
  coverImage: string;
  formats: ('pdf' | 'epub' | 'mobi')[];
  languages: ('en' | 'pl')[];
  pricing: {
    usd: number; // $9.99 → 999 cents
    pln: number; // 39 PLN → 3900 groszy
  };
  files: {
    en: {
      pdf?: string;
      epub?: string;
      mobi?: string;
    };
    pl: {
      pdf?: string;
      epub?: string;
      mobi?: string;
    };
  };
  sampleChapter?: string;
  metadata: {
    pages?: number;
    isbn?: string;
    publishDate?: string;
  };
}

export const EBOOK_PRODUCTS: EbookProduct[] = [
  {
    id: 'prod_mirrors',
    slug: 'mirrors-we-dont-have',
    title: {
      en: "Mirrors We Don't Have",
      pl: "Lustra, których nie mamy"
    },
    description: {
      en: "Four people, four different stories marked by loneliness...",
      pl: "Cztery osoby, cztery różne historie naznaczone samotnością..."
    },
    coverImage: '/books/Mirrors - print cover.png',
    formats: ['pdf', 'epub', 'mobi'],
    languages: ['en', 'pl'],
    pricing: {
      usd: 999,  // $9.99
      pln: 3900  // 39 PLN
    },
    files: {
      en: {
        pdf: '/content/ebooks/mirrors-we-dont-have/mirrors-en.pdf',
        epub: '/content/ebooks/mirrors-we-dont-have/mirrors-en.epub',
        mobi: '/content/ebooks/mirrors-we-dont-have/mirrors-en.mobi',
      },
      pl: {
        pdf: '/content/ebooks/mirrors-we-dont-have/mirrors-pl.pdf',
        epub: '/content/ebooks/mirrors-we-dont-have/mirrors-pl.epub',
        mobi: '/content/ebooks/mirrors-we-dont-have/mirrors-pl.mobi',
      }
    },
    sampleChapter: '/samples/mirrors-sample.pdf',
    metadata: {
      isbn: '978-8396965758',
      publishDate: '2024'
    }
  },
  // ... other products
];

export function getProductBySlug(slug: string): EbookProduct | undefined {
  return EBOOK_PRODUCTS.find(p => p.slug === slug);
}

export function getAllProducts(): EbookProduct[] {
  return EBOOK_PRODUCTS;
}
```

3. **app/api/payment/create-checkout/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/client';
import { getProductBySlug } from '@/lib/ebooks/products';

export async function POST(request: NextRequest) {
  try {
    const { productSlug, language, customerEmail, currency = 'usd' } = await request.json();

    const product = getProductBySlug(productSlug);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Determine price based on currency
    const price = currency === 'pln' ? product.pricing.pln : product.pricing.usd;
    const displayCurrency = currency.toUpperCase();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: product.title[language as 'en' | 'pl'],
            description: `Digital book (PDF, EPUB, MOBI) - ${language.toUpperCase()}`,
            images: [product.coverImage],
            metadata: {
              productSlug,
              language
            }
          },
          unit_amount: price,
        },
        quantity: 1,
      }],
      customer_email: customerEmail,
      success_url: STRIPE_CONFIG.successUrl.replace('{lang}', language),
      cancel_url: STRIPE_CONFIG.cancelUrl.replace('{lang}', language),
      metadata: {
        productSlug,
        language,
        customerEmail
      },
      automatic_tax: {
        enabled: true, // Stripe Tax handles VAT/sales tax
      }
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    );
  }
}
```

**Day 3-4: Database Schema & Order Management**

4. **lib/database/schema.sql**
```sql
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_slug TEXT NOT NULL,
  language TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  metadata TEXT -- JSON
);

-- Download tokens table
CREATE TABLE IF NOT EXISTS download_tokens (
  token TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  language TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  file_paths TEXT NOT NULL, -- JSON: {pdf, epub, mobi}
  max_downloads INTEGER DEFAULT 5,
  download_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  first_download_at DATETIME,
  last_download_at DATETIME,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Download events (analytics)
CREATE TABLE IF NOT EXISTS download_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL,
  order_id TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf', 'epub', 'mobi'
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (token) REFERENCES download_tokens(token),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Customer emails (for marketing)
CREATE TABLE IF NOT EXISTS customers (
  email TEXT PRIMARY KEY,
  name TEXT,
  first_purchase_date DATETIME,
  total_purchases INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  preferred_language TEXT,
  marketing_consent BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_tokens_order ON download_tokens(order_id);
CREATE INDEX idx_tokens_expires ON download_tokens(expires_at);
```

5. **lib/database/orders.ts**
```typescript
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data', 'ecommerce.db'));

// Initialize database
const schema = fs.readFileSync(
  path.join(process.cwd(), 'lib/database/schema.sql'),
  'utf-8'
);
db.exec(schema);

export interface Order {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent_id?: string;
  customer_email: string;
  customer_name?: string;
  product_slug: string;
  language: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  completed_at?: string;
  metadata?: string;
}

export function createOrder(order: Omit<Order, 'created_at'>): Order {
  const stmt = db.prepare(`
    INSERT INTO orders (
      id, stripe_session_id, customer_email, customer_name,
      product_slug, language, amount, currency, status, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    order.id,
    order.stripe_session_id,
    order.customer_email,
    order.customer_name || null,
    order.product_slug,
    order.language,
    order.amount,
    order.currency,
    order.status,
    order.metadata || null
  );

  return getOrderById(order.id)!;
}

export function getOrderById(id: string): Order | undefined {
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  return stmt.get(id) as Order | undefined;
}

export function getOrderBySessionId(sessionId: string): Order | undefined {
  const stmt = db.prepare('SELECT * FROM orders WHERE stripe_session_id = ?');
  return stmt.get(sessionId) as Order | undefined;
}

export function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  paymentIntentId?: string
): void {
  const stmt = db.prepare(`
    UPDATE orders
    SET status = ?,
        stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
        completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
    WHERE id = ?
  `);

  stmt.run(status, paymentIntentId || null, status, orderId);
}

export function getCustomerOrders(email: string): Order[] {
  const stmt = db.prepare('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC');
  return stmt.all(email) as Order[];
}
```

**Day 5-7: Watermarking System**

6. **lib/ebooks/watermark-pdf.ts** (Adapted from ascendo-analytics)
```typescript
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export interface WatermarkOptions {
  sourcePath: string;
  customerEmail: string;
  customerName: string;
  purchaseDate: Date;
  orderId: string;
  outputPath: string;
  language: string;
}

export async function watermarkPDF(options: WatermarkOptions): Promise<string> {
  const {
    sourcePath,
    customerEmail,
    customerName,
    purchaseDate,
    orderId,
    outputPath,
    language
  } = options;

  // Read source PDF
  const existingPdfBytes = await fs.readFile(sourcePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 8;
  const lineHeight = 10;

  // Watermark text (bilingual support)
  const dateStr = purchaseDate.toISOString().split('T')[0];
  const watermarkLines = language === 'pl' ? [
    `Licencja dla: ${customerName || customerEmail}`,
    `Email: ${customerEmail}`,
    `Data zakupu: ${dateStr}`,
    `ID: ${orderId.substring(0, 20)}...`
  ] : [
    `Licensed to: ${customerName || customerEmail}`,
    `Email: ${customerEmail}`,
    `Purchase date: ${dateStr}`,
    `ID: ${orderId.substring(0, 20)}...`
  ];

  // Add watermark to each page
  const pages = pdfDoc.getPages();
  const watermarkColor = rgb(0.4, 0.4, 0.4);
  const opacity = 0.3;

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Bottom-right corner position
    const marginRight = 20;
    const marginBottom = 20;
    const maxTextWidth = Math.max(
      ...watermarkLines.map(line => font.widthOfTextAtSize(line, fontSize))
    );

    const xPosition = width - maxTextWidth - marginRight;
    let yPosition = marginBottom;

    // Draw watermark
    for (let i = watermarkLines.length - 1; i >= 0; i--) {
      page.drawText(watermarkLines[i], {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        font: font,
        color: watermarkColor,
        opacity: opacity
      });
      yPosition += lineHeight;
    }
  }

  // Embed metadata
  pdfDoc.setTitle(`${customerName || 'Customer'} - ${orderId}`);
  pdfDoc.setAuthor('Sebastian Proba');
  pdfDoc.setSubject(`Licensed to: ${customerEmail}`);
  pdfDoc.setKeywords([customerEmail, orderId, dateStr]);
  pdfDoc.setProducer('Narratia.pl Ebook Store');
  pdfDoc.setCreationDate(purchaseDate);

  // Ensure output directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Save watermarked PDF
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, pdfBytes);

  return outputPath;
}
```

7. **lib/ebooks/watermark-epub.ts**
```typescript
import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';

export async function watermarkEPUB(options: WatermarkOptions): Promise<string> {
  const { sourcePath, customerEmail, customerName, orderId, outputPath, language } = options;

  // Read EPUB (it's a ZIP file)
  const zip = new AdmZip(sourcePath);

  // Create watermark HTML
  const watermarkHtml = language === 'pl'
    ? `<div style="font-size: 10px; color: #666; opacity: 0.5; text-align: center; margin: 20px 0;">
        Licencja dla: ${customerName || customerEmail} | ID: ${orderId}
      </div>`
    : `<div style="font-size: 10px; color: #666; opacity: 0.5; text-align: center; margin: 20px 0;">
        Licensed to: ${customerName || customerEmail} | ID: ${orderId}
      </div>`;

  // Find all HTML/XHTML content files
  const entries = zip.getEntries();
  for (const entry of entries) {
    if (entry.entryName.match(/\.(x?html)$/i)) {
      let content = entry.getData().toString('utf8');

      // Insert watermark before </body>
      content = content.replace('</body>', `${watermarkHtml}</body>`);

      // Update entry
      zip.updateFile(entry, Buffer.from(content, 'utf8'));
    }
  }

  // Update metadata in content.opf
  const opfEntry = entries.find(e => e.entryName.endsWith('.opf'));
  if (opfEntry) {
    let opfContent = opfEntry.getData().toString('utf8');

    // Add custom metadata
    const customMeta = `
      <meta property="dcterms:modified">${new Date().toISOString()}</meta>
      <meta property="narratia:customer">${customerEmail}</meta>
      <meta property="narratia:orderId">${orderId}</meta>
    `;

    opfContent = opfContent.replace('</metadata>', `${customMeta}</metadata>`);
    zip.updateFile(opfEntry, Buffer.from(opfContent, 'utf8'));
  }

  // Save watermarked EPUB
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  zip.writeZip(outputPath);

  return outputPath;
}
```

**Additional dependencies needed:**
```bash
npm install adm-zip @types/adm-zip
```

#### Week 2: Purchase Flow & Email System

**Day 8-10: Webhook Handler & Order Fulfillment**

8. **app/api/payment/webhook/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createOrder, updateOrderStatus } from '@/lib/database/orders';
import { fulfillOrder } from '@/lib/ebooks/fulfillment';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;

      case 'payment_intent.succeeded':
        // Track successful payment
        console.log('Payment succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  const { id, customer_email, amount_total, currency, metadata } = session;
  const { productSlug, language } = metadata;

  // Create order record
  const order = createOrder({
    id: `ord_${Date.now()}`,
    stripe_session_id: id,
    customer_email,
    product_slug: productSlug,
    language,
    amount: amount_total,
    currency,
    status: 'pending',
    metadata: JSON.stringify(metadata)
  });

  try {
    // Fulfill order (watermark + send email)
    await fulfillOrder(order);

    // Update order status
    updateOrderStatus(order.id, 'completed');

    console.log(`✅ Order fulfilled: ${order.id}`);
  } catch (error: any) {
    console.error(`❌ Order fulfillment failed: ${order.id}`, error);
    updateOrderStatus(order.id, 'failed');
  }
}
```

9. **lib/ebooks/fulfillment.ts**
```typescript
import { Order } from '@/lib/database/orders';
import { getProductBySlug } from './products';
import { watermarkPDF } from './watermark-pdf';
import { watermarkEPUB } from './watermark-epub';
import { createDownloadToken } from '@/lib/downloads/tokens';
import { sendPurchaseEmail } from '@/lib/emails/templates/purchase-confirmation';
import path from 'path';
import fs from 'fs/promises';

export async function fulfillOrder(order: Order): Promise<void> {
  const product = getProductBySlug(order.product_slug);
  if (!product) {
    throw new Error(`Product not found: ${order.product_slug}`);
  }

  const lang = order.language as 'en' | 'pl';
  const outputDir = path.join(
    process.cwd(),
    'secure/watermarked',
    order.id
  );

  await fs.mkdir(outputDir, { recursive: true });

  const watermarkedFiles: Record<string, string> = {};

  // Watermark PDF
  if (product.files[lang].pdf) {
    const pdfOutput = path.join(outputDir, `${order.product_slug}.pdf`);
    await watermarkPDF({
      sourcePath: path.join(process.cwd(), product.files[lang].pdf!),
      customerEmail: order.customer_email,
      customerName: order.customer_name || '',
      purchaseDate: new Date(order.created_at),
      orderId: order.id,
      outputPath: pdfOutput,
      language: lang
    });
    watermarkedFiles.pdf = pdfOutput;
  }

  // Watermark EPUB
  if (product.files[lang].epub) {
    const epubOutput = path.join(outputDir, `${order.product_slug}.epub`);
    await watermarkEPUB({
      sourcePath: path.join(process.cwd(), product.files[lang].epub!),
      customerEmail: order.customer_email,
      customerName: order.customer_name || '',
      purchaseDate: new Date(order.created_at),
      orderId: order.id,
      outputPath: epubOutput,
      language: lang
    });
    watermarkedFiles.epub = epubOutput;
  }

  // Copy MOBI (watermarking MOBI is complex, just add metadata)
  if (product.files[lang].mobi) {
    const mobiSource = path.join(process.cwd(), product.files[lang].mobi!);
    const mobiOutput = path.join(outputDir, `${order.product_slug}.mobi`);
    await fs.copyFile(mobiSource, mobiOutput);
    watermarkedFiles.mobi = mobiOutput;
  }

  // Create download token (7 days, max 5 downloads)
  const downloadToken = await createDownloadToken({
    orderId: order.id,
    productSlug: order.product_slug,
    language: lang,
    customerEmail: order.customer_email,
    filePaths: watermarkedFiles,
    maxDownloads: 5,
    expiresInDays: 7
  });

  // Send purchase confirmation email
  await sendPurchaseEmail({
    to: order.customer_email,
    customerName: order.customer_name || order.customer_email,
    product: product,
    language: lang,
    downloadUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/${downloadToken}`,
    orderId: order.id
  });

  // Save metadata
  await fs.writeFile(
    path.join(outputDir, 'metadata.json'),
    JSON.stringify({
      orderId: order.id,
      customerEmail: order.customer_email,
      product: order.product_slug,
      language: lang,
      fulfilledAt: new Date().toISOString(),
      files: watermarkedFiles
    }, null, 2)
  );
}
```

10. **lib/downloads/tokens.ts**
```typescript
import Database from 'better-sqlite3';
import { randomBytes } from 'crypto';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data', 'ecommerce.db'));

export interface DownloadToken {
  token: string;
  order_id: string;
  product_slug: string;
  language: string;
  customer_email: string;
  file_paths: string; // JSON
  max_downloads: number;
  download_count: number;
  created_at: string;
  expires_at: string;
  first_download_at?: string;
  last_download_at?: string;
}

export async function createDownloadToken(params: {
  orderId: string;
  productSlug: string;
  language: string;
  customerEmail: string;
  filePaths: Record<string, string>;
  maxDownloads: number;
  expiresInDays: number;
}): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + params.expiresInDays);

  const stmt = db.prepare(`
    INSERT INTO download_tokens (
      token, order_id, product_slug, language, customer_email,
      file_paths, max_downloads, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    token,
    params.orderId,
    params.productSlug,
    params.language,
    params.customerEmail,
    JSON.stringify(params.filePaths),
    params.maxDownloads,
    expiresAt.toISOString()
  );

  return token;
}

export function getDownloadToken(token: string): DownloadToken | undefined {
  const stmt = db.prepare('SELECT * FROM download_tokens WHERE token = ?');
  return stmt.get(token) as DownloadToken | undefined;
}

export function incrementDownloadCount(token: string): void {
  const stmt = db.prepare(`
    UPDATE download_tokens
    SET download_count = download_count + 1,
        first_download_at = COALESCE(first_download_at, CURRENT_TIMESTAMP),
        last_download_at = CURRENT_TIMESTAMP
    WHERE token = ?
  `);
  stmt.run(token);
}

export function isTokenValid(tokenData: DownloadToken): { valid: boolean; reason?: string } {
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);

  if (now > expiresAt) {
    return { valid: false, reason: 'expired' };
  }

  if (tokenData.download_count >= tokenData.max_downloads) {
    return { valid: false, reason: 'limit_reached' };
  }

  return { valid: true };
}
```

**Day 11-12: Download API**

11. **app/api/download/[token]/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDownloadToken, incrementDownloadCount, isTokenValid } from '@/lib/downloads/tokens';
import { trackDownloadEvent } from '@/lib/downloads/analytics';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const format = request.nextUrl.searchParams.get('format') || 'pdf';

    // Get token data
    const tokenData = getDownloadToken(token);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid download link' },
        { status: 404 }
      );
    }

    // Validate token
    const validation = isTokenValid(tokenData);
    if (!validation.valid) {
      const message = validation.reason === 'expired'
        ? 'Download link has expired'
        : 'Download limit reached';

      return NextResponse.json({ error: message }, { status: 403 });
    }

    // Get file path
    const filePaths = JSON.parse(tokenData.file_paths);
    const filePath = filePaths[format];

    if (!filePath) {
      return NextResponse.json(
        { error: `Format ${format} not available` },
        { status: 404 }
      );
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    // Increment download count
    incrementDownloadCount(token);

    // Track download event
    await trackDownloadEvent({
      token,
      orderId: tokenData.order_id,
      fileType: format,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Return file
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      epub: 'application/epub+zip',
      mobi: 'application/x-mobipocket-ebook'
    };

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeTypes[format] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    });

  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}
```

**Day 13-14: Email Templates**

12. **lib/emails/templates/purchase-confirmation.ts**
```typescript
import { sendEmail } from '@/lib/email';
import { EbookProduct } from '@/lib/ebooks/products';

interface PurchaseEmailParams {
  to: string;
  customerName: string;
  product: EbookProduct;
  language: 'en' | 'pl';
  downloadUrl: string;
  orderId: string;
}

export async function sendPurchaseEmail(params: PurchaseEmailParams) {
  const { to, customerName, product, language, downloadUrl, orderId } = params;

  const subject = language === 'pl'
    ? `Twoja książka: ${product.title.pl}`
    : `Your book: ${product.title.en}`;

  const html = language === 'pl' ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50;">Dziękuję za zakup!</h1>

        <p>Cześć ${customerName},</p>

        <p>Dziękuję za zakup książki <strong>${product.title.pl}</strong>.</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h2 style="margin-top: 0; color: #2c3e50;">📚 Pobierz swoją książkę</h2>
          <p>Twoja spersonalizowana wersja książki jest dostępna w trzech formatach:</p>
          <ul>
            <li>PDF (do czytania na komputerze)</li>
            <li>EPUB (Kindle, Apple Books, Kobo)</li>
            <li>MOBI (starsze Kindle)</li>
          </ul>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${downloadUrl}"
               style="display: inline-block; background: #3498db; color: white; padding: 15px 30px;
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              Pobierz wszystkie formaty
            </a>
          </div>
        </div>

        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #856404;">⚠️ Ważne informacje</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Link jest ważny przez <strong>7 dni</strong></li>
            <li>Możesz pobrać pliki maksymalnie <strong>5 razy</strong></li>
            <li>Książka zawiera Twoje dane (email) jako zabezpieczenie</li>
            <li>Zapisz pliki w bezpiecznym miejscu</li>
          </ul>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <h3>💬 Spodobała Ci się książka?</h3>
        <p>Twoja opinia jest dla mnie bardzo ważna! Jeśli masz chwilę, zostaw recenzję na:</p>
        <ul>
          <li><a href="https://www.goodreads.com">Goodreads</a></li>
          <li><a href="https://www.amazon.com">Amazon</a></li>
        </ul>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="color: #666; font-size: 14px;">
          <strong>Numer zamówienia:</strong> ${orderId}<br>
          <strong>Pytania?</strong> Odpowiedz na tego maila – zawsze chętnie pomogę!
        </p>

        <p>Serdecznie pozdrawiam,<br>
        <strong>Sebastian Proba</strong><br>
        <a href="https://narratia.pl">narratia.pl</a></p>
      </div>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50;">Thank you for your purchase!</h1>

        <p>Hi ${customerName},</p>

        <p>Thank you for purchasing <strong>${product.title.en}</strong>.</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h2 style="margin-top: 0; color: #2c3e50;">📚 Download your book</h2>
          <p>Your personalized copy is available in three formats:</p>
          <ul>
            <li>PDF (for reading on computer)</li>
            <li>EPUB (Kindle, Apple Books, Kobo)</li>
            <li>MOBI (older Kindle devices)</li>
          </ul>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${downloadUrl}"
               style="display: inline-block; background: #3498db; color: white; padding: 15px 30px;
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              Download all formats
            </a>
          </div>
        </div>

        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #856404;">⚠️ Important information</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Download link valid for <strong>7 days</strong></li>
            <li>Maximum <strong>5 downloads</strong> allowed</li>
            <li>Book contains your email as security watermark</li>
            <li>Save files in a safe location</li>
          </ul>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <h3>💬 Did you enjoy the book?</h3>
        <p>Your review means the world to me! If you have a moment, please leave a review on:</p>
        <ul>
          <li><a href="https://www.goodreads.com">Goodreads</a></li>
          <li><a href="https://www.amazon.com">Amazon</a></li>
        </ul>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="color: #666; font-size: 14px;">
          <strong>Order ID:</strong> ${orderId}<br>
          <strong>Questions?</strong> Reply to this email – I'm always happy to help!
        </p>

        <p>Best regards,<br>
        <strong>Sebastian Proba</strong><br>
        <a href="https://narratia.pl">narratia.pl</a></p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to,
    subject,
    html
  });
}
```

---

### **Phase 2: Shop Pages & UI (Week 3)**

#### Shop Infrastructure

13. **app/[lang]/shop/page.tsx** - All ebooks listing
14. **app/[lang]/shop/[slug]/page.tsx** - Individual ebook purchase page
15. **components/shop/BuyButton.tsx** - Purchase CTA
16. **components/shop/EbookCard.tsx** - Product display

#### Checkout Pages

17. **app/[lang]/checkout/success/page.tsx** - Success page with download instructions
18. **app/[lang]/checkout/cancelled/page.tsx** - Cancelled payment
19. **app/[lang]/checkout/expired/page.tsx** - Expired download link

---

### **Phase 3: Marketing Features (Week 4)**

#### Email Sequences

20. **Abandoned Cart Recovery** - Send email if checkout not completed
21. **Review Request** - 7 days after purchase
22. **Upsell Sequence** - Recommend other books

#### Analytics

23. **Conversion Tracking** - Track purchases in Google Analytics
24. **Revenue Dashboard** - Admin view of sales
25. **Customer Insights** - Purchase patterns, popular books

---

## 🎨 Marketing Strategy

### Pricing Strategy

**Individual Books:**
- **Premium novels**: $9.99 USD / 39 PLN
- **Essays/shorter works**: $4.99 USD / 19 PLN

**Why direct sales beat distributors:**
```
Amazon Kindle (70% royalty):
  $9.99 book → $7.00 to author (after delivery fees)

Direct sale:
  $9.99 book → $9.40 to you (after Stripe 2.9% + $0.30)

Margin improvement: 34% more revenue per sale
```

### Sales Funnels

**Funnel 1: Free Chapter → Purchase**
```
1. Visitor reads blog post
2. Download free sample chapter
3. Email sequence (3 emails over 7 days)
4. CTA: Buy full ebook
```

**Funnel 2: Book Page → Direct Sale**
```
1. Visitor lands on book page
2. Read description, reviews, sample
3. Click "Buy Now"
4. Stripe checkout
5. Download link in email
```

**Funnel 3: Bundle Upsell**
```
1. Customer buys one book
2. Thank you email includes bundle offer
3. "Get all 3 books for $19.99 (save $10!)"
```

### Email Sequences

**Post-Purchase Sequence:**
- **Day 0**: Purchase confirmation + download link
- **Day 3**: "Did you get your book? Need help?"
- **Day 7**: "How are you enjoying [Book]? Leave a review?"
- **Day 14**: "PS - Check out my other book: [Title]"

**Abandoned Cart Recovery:**
- **1 hour**: "Still interested in [Book]?"
- **1 day**: "Here's a 10% discount code: COMEBACK10"
- **3 days**: Last chance email

### Marketing Tactics

1. **Exit-Intent Popup**: Capture email before they leave
2. **Sample Chapters**: Always available as lead magnets
3. **Bundle Discounts**: 3 books for price of 2
4. **Launch Discounts**: New book at $4.99 for first week
5. **Review Incentives**: "Leave review, get next book 20% off"
6. **Affiliate Program** (Phase 3): Bloggers get 20% commission

---

## 📊 Success Metrics

### Key Performance Indicators (KPIs)

**Revenue Metrics:**
- Monthly recurring revenue (MRR) from ebook sales
- Average order value (AOV)
- Customer lifetime value (CLV)

**Conversion Metrics:**
- Visitor → Email subscriber: 10-15%
- Email subscriber → Customer: 5-10%
- Product page → Purchase: 2-5%
- Abandoned cart recovery: 15-25%

**Engagement Metrics:**
- Email open rate: 35-45%
- Email click rate: 10-15%
- Download completion rate: 95%+

### Revenue Projections

**Conservative Estimate (Month 3):**
```
100 visitors/day
15% email capture = 15 subscribers/day = 450/month
5% conversion = 22 sales/month
Average $8 per sale = $176/month

Operating costs:
- Stripe fees: ~$15/month
- Email (SendGrid): $0 (free tier)
- Hosting (Vercel): $0 (free tier)

Net profit: ~$160/month
```

**Growth Scenario (Month 12):**
```
500 visitors/day
20% email capture = 100 subscribers/day = 3,000/month
7% conversion = 210 sales/month
Average $9 per sale = $1,890/month

Net profit: ~$1,835/month
```

---

## 🔒 Security & Legal

### Data Protection (GDPR Compliance)

1. **Privacy Policy**: Update to cover:
   - Payment processing (Stripe)
   - Email marketing (SendGrid/Mailchimp)
   - Download tracking
   - Cookie usage

2. **Customer Rights**:
   - Right to access data
   - Right to deletion
   - Right to download data
   - Unsubscribe from emails

3. **Data Retention**:
   - Orders: Kept indefinitely (tax compliance)
   - Download tokens: Auto-delete after expiry
   - Watermarked files: Keep for 30 days, then archive

### Payment Security

- **PCI Compliance**: Stripe handles all card data
- **Fraud Prevention**: Stripe Radar enabled
- **Refund Policy**: 14-day money-back guarantee
- **Terms of Service**: Clear digital goods terms

### Watermark Protection

**PDF Watermark Example:**
```
Licensed to: customer@example.com
Purchase date: 2025-11-20
Order ID: ord_1729534892
```

**Why watermarking works:**
- Deters sharing (personal info visible)
- Traceable if pirated
- Professional reminder of license

---

## 🚀 Launch Checklist

### Pre-Launch (Before going live)

**Technical:**
- [ ] Stripe account verified and activated
- [ ] Webhook endpoints tested
- [ ] Watermarking tested on all formats
- [ ] Email delivery tested
- [ ] Download links tested
- [ ] Error handling tested (failed payments, etc.)
- [ ] Mobile responsive checkout

**Content:**
- [ ] All ebook files prepared (PDF, EPUB, MOBI)
- [ ] Product descriptions written (EN + PL)
- [ ] Sample chapters uploaded
- [ ] Email templates finalized
- [ ] Terms of Service page
- [ ] Privacy Policy updated
- [ ] Refund policy page

**Legal:**
- [ ] Tax registration (if required in your country)
- [ ] Stripe tax settings configured
- [ ] GDPR compliance verified
- [ ] Cookie consent banner (if needed)

**Marketing:**
- [ ] Announcement blog post written
- [ ] Email to existing subscribers drafted
- [ ] Social media posts prepared
- [ ] Launch discount code created

### Launch Day

1. Deploy to production
2. Test complete purchase flow (live mode)
3. Announce on blog
4. Email subscribers
5. Post on social media
6. Monitor for issues

### Post-Launch (First week)

- [ ] Daily monitoring of sales & errors
- [ ] Respond to customer emails within 24h
- [ ] Fix any bugs immediately
- [ ] Track conversion rates
- [ ] Adjust pricing if needed
- [ ] Gather customer feedback

---

## 🛠️ Environment Variables

Create `.env.local`:

```bash
# Base URL
NEXT_PUBLIC_BASE_URL=https://narratia.pl

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SendGrid)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=books@narratia.pl
SENDGRID_FROM_NAME=Sebastian Proba

# Database
DATABASE_PATH=./data/ecommerce.db

# Download settings
DOWNLOAD_TOKEN_EXPIRY_DAYS=7
DOWNLOAD_MAX_COUNT=5

# Security
SECURE_FILES_PATH=./secure

# Tax (if using Stripe Tax)
STRIPE_TAX_ENABLED=true
```

---

## 💰 Cost Analysis

### Direct Sales vs. Distribution Platforms

**Scenario: Selling "Mirrors We Don't Have" at $9.99**

| Platform | Your Revenue | Platform Fee | Net Margin |
|----------|-------------|--------------|------------|
| **narratia.pl (direct)** | $9.40 | 6% (Stripe) | 94% |
| Amazon KDP (70% royalty) | $7.00 | 30% + delivery | 70% |
| Amazon KDP (35% royalty) | $3.50 | 65% | 35% |
| Draft2Digital | $6.50 | 10% + retail cut | 65% |

**Break-even analysis:**
- Need ~5 sales/month to cover Stripe minimum fees
- Each sale = $2.40 more profit than Amazon
- 100 sales = $240 extra revenue vs. Amazon

**Why direct sales win:**
1. Higher margins (94% vs 70%)
2. Customer email addresses (for future marketing)
3. No platform restrictions
4. Full control over pricing
5. Upsell opportunities

---

## 📝 Next Steps

### Immediate Actions (Today)

1. **Review this plan** - Adjust based on your priorities
2. **Prepare ebook files** - Get PDF/EPUB/MOBI versions ready
3. **Create Stripe account** - If not already done
4. **Set pricing** - Decide on USD/PLN prices

### This Week

1. **Start Phase 1 implementation** - Core infrastructure
2. **Write product descriptions** - For shop pages
3. **Design shop pages** - Mockups or wireframes
4. **Prepare sample chapters** - Lead magnets

### This Month

1. **Complete technical implementation** - All 3 phases
2. **Test everything thoroughly** - No bugs on launch day
3. **Create marketing materials** - Emails, social posts
4. **Soft launch** - Email list first, then public

---

## 🎯 Summary

This plan gives you:

✅ **Complete e-commerce system** for selling ebooks directly
✅ **Secure digital delivery** with watermarked files
✅ **Marketing automation** for conversions & upsells
✅ **94% profit margins** vs 70% on Amazon
✅ **Customer ownership** (emails for future books)
✅ **Professional experience** for buyers
✅ **Scalable foundation** for future products

**Timeline**: 3-4 weeks to launch
**Investment**: ~$0/month (free tier hosting + pay-per-sale Stripe fees)
**ROI**: 34% higher revenue per sale vs. Amazon

Ready to start? Let's build this! 🚀
