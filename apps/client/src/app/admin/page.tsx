import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Navbar } from '@/components/navbar';
import { ProductForm } from './product-form';
import { ProductList, type ProductRow } from './product-list';
import { createProduct } from './actions';

export const metadata = {
  title: 'Admin — Voguify',
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function getAllProducts(): Promise<ProductRow[]> {
  try {
    const res = await fetch(`${API_BASE}/products?all=1`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as ProductRow[];
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/');

  const products = await getAllProducts();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-black/60">
            Signed in as {session.user.email}.
          </p>
        </div>

        <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-lg font-bold">Add a product</h2>
          <ProductForm action={createProduct} submitLabel="Create product" />
        </section>

        <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="mb-4 text-lg font-bold">
            Products{' '}
            <span className="text-sm font-normal text-black/50">
              ({products.length})
            </span>
          </h2>
          <ProductList products={products} />
        </section>
      </main>
    </>
  );
}
