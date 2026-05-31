'use client';

import { usePathname } from 'next/navigation';

export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide on all /admin... routes and /login
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }
  
  return <>{children}</>;
}
