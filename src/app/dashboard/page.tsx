'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
  const { user, isInitialized } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
      const currentPath = window.location.pathname;
      
      if (currentPath === '/dashboard') {
        if (user.siteAdmin === true) {
          router.replace('/dashboard/admin');
        } else {
          const redirectPath = user.userType === 'Shelter' ? '/dashboard/shelter' : '/dashboard/user';
          router.replace(redirectPath);
        }
      }
    }
  }, [user, isInitialized, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}