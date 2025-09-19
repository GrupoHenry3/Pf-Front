"use client";
import { DonationFlow } from '@/components/donationApplication/DonationFlow';
import type { User } from '@/interfaces/User';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const mockUser: User = {
  id: 'u1',
  name: 'María López',
  email: 'maria@example.com',
  role: 'adopter',
  password: '123456',
  confirmed_password: true,
};

export default function DonationsPage() {
  const router = useRouter();
  return (
    <DonationFlow
      user={mockUser}
      onBack={() => router.push('/')}
    />
  );
} 