'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export type ProductFormState = {
  ok: boolean;
  message?: string;
  slug?: string;
};

// Back-compat alias (the create form imported this name).
export type CreateProductState = ProductFormState;

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

function str(formData: FormData, key: string): string | undefined {
  const v = String(formData.get(key) ?? '').trim();
  return v.length ? v : undefined;
}

function int(formData: FormData, key: string): number | undefined {
  const raw = String(formData.get(key) ?? '').trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function cents(formData: FormData, key: string): number | undefined {
  const raw = String(formData.get(key) ?? '').trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n * 100) : undefined;
}

/** Build the product payload shared by create + update. */
function buildPayload(formData: FormData):
  | { ok: true; name: string; slug: string; data: Record<string, unknown> }
  | { ok: false; message: string } {
  const name = str(formData, 'name');
  const slug = str(formData, 'slug');
  if (!name || !slug) {
    return { ok: false, message: 'Name and slug are required.' };
  }

  let images: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get('images') ?? '[]'));
    if (Array.isArray(parsed)) {
      images = parsed.filter((u) => typeof u === 'string');
    }
  } catch {
    images = [];
  }
  if (images.length === 0) {
    return { ok: false, message: 'Upload at least one image.' };
  }

  const highlights = String(formData.get('highlights') ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    ok: true,
    name,
    slug,
    data: {
      name,
      slug,
      description: str(formData, 'description') ?? null,
      highlights,
      priceCents: cents(formData, 'price') ?? 0,
      premiumCents: cents(formData, 'premium') ?? null,
      imageUrl: images[0],
      images,
      brand: str(formData, 'brand') ?? null,
      styleNo: str(formData, 'styleNo') ?? null,
      category: str(formData, 'category') ?? null,
      bestseller: formData.get('bestseller') === 'on',
      sizes: int(formData, 'sizes') ?? null,
      colors: int(formData, 'colors') ?? null,
      printProviders: int(formData, 'printProviders') ?? null,
      published: formData.get('published') === 'on',
    },
  };
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await isAdmin())) return { ok: false, message: 'Not authorized.' };

  const built = buildPayload(formData);
  if (!built.ok) return built;

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(built.data),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        message: `API error (${res.status}). A product with this slug may already exist. ${body.slice(0, 160)}`,
      };
    }
  } catch {
    return {
      ok: false,
      message: 'Could not reach the API. Is the NestJS server running (pnpm dev)?',
    };
  }

  revalidatePath('/products');
  revalidatePath('/admin');
  return { ok: true, message: `Created "${built.name}".`, slug: built.slug };
}

export async function updateProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await isAdmin())) return { ok: false, message: 'Not authorized.' };

  const id = str(formData, 'id');
  if (!id) return { ok: false, message: 'Missing product id.' };

  const built = buildPayload(formData);
  if (!built.ok) return built;

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(built.data),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, message: `API error (${res.status}). ${body.slice(0, 160)}` };
    }
  } catch {
    return {
      ok: false,
      message: 'Could not reach the API. Is the NestJS server running (pnpm dev)?',
    };
  }

  revalidatePath('/products');
  revalidatePath(`/products/${built.slug}`);
  revalidatePath('/admin');
  return { ok: true, message: `Saved "${built.name}".`, slug: built.slug };
}

/** Delete a product. Called from a plain <form action> in the admin list. */
export async function deleteProduct(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  try {
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  } catch {
    // Surfaced by the list not changing; nothing else to do here.
  }

  revalidatePath('/products');
  revalidatePath('/admin');
}
