import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Navbar } from '@/components/navbar';
import { ProductForm, type ProductInitial } from '../../product-form';
import { updateProduct } from '../../actions';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type ApiProduct = ProductInitial & {
  id: string;
  imageUrl: string | null;
};

async function getProduct(id: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as ApiProduct | null;
    return data && data.id ? data : null;
  } catch {
    return null;
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/');

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const initial: ProductInitial = {
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    styleNo: product.styleNo,
    category: product.category,
    priceCents: product.priceCents,
    premiumCents: product.premiumCents,
    sizes: product.sizes,
    colors: product.colors,
    printProviders: product.printProviders,
    description: product.description,
    highlights: product.highlights ?? [],
    bestseller: product.bestseller,
    published: product.published,
    images: product.images?.length
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [],
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-semibold text-black/60 underline underline-offset-4 hover:text-black"
          >
            ← Back to admin
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Edit product
          </h1>
          <p className="mt-1 text-sm text-black/60">{product.name}</p>
        </div>

        <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <ProductForm
            action={updateProduct}
            initial={initial}
            productId={product.id}
            submitLabel="Save changes"
          />
        </section>
      </main>
    </>
  );
}
