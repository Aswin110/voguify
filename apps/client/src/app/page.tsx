export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Voguify</h1>
      <p className="text-neutral-500">
        Next.js web app. The NestJS API lives at{' '}
        <code className="rounded bg-neutral-200 px-1 py-0.5 dark:bg-neutral-800">
          {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}
        </code>
      </p>
    </main>
  );
}
