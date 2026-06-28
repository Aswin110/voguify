import { PrismaClient, type Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const products: Prisma.ProductCreateInput[] = [
  {
    slug: 'ceramic-mug',
    name: 'Ceramic Mug, (11oz, 15oz)',
    description: 'Glossy ceramic mug, dishwasher and microwave safe.',
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
