import { AuthView } from '@neondatabase/auth/react';

export const dynamicParams = false;

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6 min-h-[calc(100vh-4rem)]">
      <div className="border-4 border-black bg-white dark:bg-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <AuthView path={path} />
      </div>
    </main>
  );
}
