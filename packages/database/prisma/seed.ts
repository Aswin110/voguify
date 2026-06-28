import { PrismaClient, type Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const products: Prisma.ProductCreateInput[] = [
  {
    slug: 'ceramic-mug',
    name: 'Ceramic Mug, (11oz, 15oz)',
    description: 'Glossy ceramic mug, dishwasher and microwave safe.',
    highlights: [
      'Durable, glossy ceramic build available in 11oz and 15oz sizes.',
      'Dishwasher and microwave safe for everyday use.',
      'Vivid, long-lasting print that wraps the full mug.',
    ],
    priceCents: 493,
    premiumCents: 368,
    brand: 'Generic brand',
    category: 'mug',
    bestseller: true,
    sizes: 2,
    printProviders: 5,
  },
  {
    slug: 'heavy-blend-hoodie',
    name: 'Unisex Heavy Blend™ Hooded Sweatshirt',
    description: 'Cozy fleece-lined pullover hoodie with a front pouch pocket.',
    highlights: [
      'Made from a heavy blend of 50% cotton and 50% polyester for warmth and durability.',
      'Air-jet spun yarn creates a soft, pill-resistant finish.',
      'Double-lined hood with matching drawcord and a roomy front pouch pocket.',
      'Ribbed cuffs and waistband keep their shape wash after wash.',
    ],
    priceCents: 2158,
    premiumCents: 1589,
    brand: 'Gildan',
    styleNo: '18500',
    category: 'hoodie',
    bestseller: true,
    sizes: 8,
    colors: 39,
    printProviders: 18,
  },
  {
    slug: 'accent-coffee-mug',
    name: 'Accent Coffee Mug (11, 15oz)',
    description: 'Two-tone accent mug with a colored handle and interior.',
    highlights: [
      'Two-tone design with a colored handle and interior.',
      'Available in 11oz and 15oz with multiple accent colors.',
      'Dishwasher and microwave safe ceramic.',
    ],
    priceCents: 625,
    premiumCents: 464,
    brand: 'Generic brand',
    category: 'mug',
    bestseller: true,
    sizes: 2,
    colors: 10,
    printProviders: 4,
  },
  {
    slug: 'heavy-cotton-tee',
    name: 'Unisex Heavy Cotton Tee',
    description: 'Classic heavyweight cotton t-shirt with a relaxed fit.',
    highlights: [
      'The Gildan 5000 is made with medium fabric (5.3 oz/yd² / 180 g/m²) consisting of 100% cotton, offering year-round comfort with lasting durability.',
      'The classic fit of this shirt ensures a comfy, relaxed wear while the crew neckline adds that neat, timeless look that can blend into any occasion, casual or semi-formal.',
      'The tear-away label means a scratch-free experience with no irritation or discomfort whatsoever.',
      'Made using 100% US cotton that is ethically grown and harvested. Gildan is also a proud member of the US Cotton Trust Protocol ensuring ethical and sustainable means of production.',
      'This blank tee is certified by OEKO-TEX® STANDARD 100 (Certificate No. 168252, OETI - Institut fuer Oekologie).',
    ],
    priceCents: 880,
    premiumCents: 620,
    brand: 'Gildan',
    styleNo: '5000',
    category: 'tee',
    bestseller: true,
    sizes: 8,
    colors: 70,
    printProviders: 23,
  },
  {
    slug: 'classic-tote-bag',
    name: 'Classic Tote Bag',
    description: 'Heavy-duty cotton tote, perfect for everyday carry.',
    highlights: [
      'Sturdy 100% cotton canvas that holds its shape.',
      'Reinforced handles for carrying heavier loads.',
      'Edge-to-edge print area on both sides.',
    ],
    priceCents: 1099,
    premiumCents: 899,
    brand: 'Generic brand',
    category: 'bag',
    sizes: 1,
    colors: 3,
    printProviders: 7,
  },
  {
    slug: 'snap-phone-case',
    name: 'Snap Phone Case',
    description: 'Slim, durable case with a glossy print finish.',
    highlights: [
      'Slim, snap-on polycarbonate shell.',
      'Glossy finish with edge-to-edge, fade-resistant print.',
      'Precise cutouts for ports, buttons and cameras.',
    ],
    priceCents: 1299,
    premiumCents: 999,
    brand: 'Generic brand',
    category: 'phone',
    sizes: 5,
    printProviders: 6,
  },
  {
    slug: 'embroidered-cap',
    name: 'Embroidered Cap',
    description: 'Structured 6-panel cap with an adjustable strap.',
    highlights: [
      'Structured 6-panel construction with a pre-curved visor.',
      'Adjustable strap fits most sizes.',
      'Crisp, durable embroidery decoration.',
    ],
    priceCents: 1599,
    premiumCents: 1299,
    brand: 'Generic brand',
    category: 'cap',
    sizes: 1,
    colors: 8,
    printProviders: 5,
  },
  {
    slug: 'pullover-hoodie',
    name: 'Pullover Hoodie',
    description: 'Soft midweight hoodie with a roomy kangaroo pocket.',
    highlights: [
      'Soft midweight fleece for everyday comfort.',
      'Roomy kangaroo pocket and double-lined hood.',
      'Ribbed cuffs and hem for a snug fit.',
    ],
    priceCents: 2299,
    premiumCents: 1799,
    brand: 'Gildan',
    styleNo: '18000',
    category: 'hoodie',
    sizes: 6,
    colors: 20,
    printProviders: 12,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  // Keep the catalog in sync with this file: drop anything not seeded here.
  const slugs = products.map((product) => product.slug);
  const { count } = await prisma.product.deleteMany({
    where: { slug: { notIn: slugs } },
  });

  console.log(`✅ Seeded ${products.length} products (removed ${count} stale)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
