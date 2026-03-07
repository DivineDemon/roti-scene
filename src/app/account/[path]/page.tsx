import { AccountView } from '@neondatabase/auth/react';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="container mx-auto p-4 md:p-6 min-h-[calc(100vh-4rem)]">
      <div className="border-4 border-black bg-white dark:bg-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <AccountView path={path} />
      </div>
    </main>
  );
}
