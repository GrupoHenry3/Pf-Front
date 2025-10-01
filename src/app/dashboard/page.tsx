'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
  const { user, isInitialized } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
        if(user.siteAdmin===true) {
            router.replace(`/dashboard/admin`);
        }
        else{
            const redirectPath = user.userType === 'Shelter' ? '/dashboard/shelter' : '/dashboard/user';
            router.replace(redirectPath);
        }
      
    }
  }, [user, isInitialized, router]);

  return null;
}