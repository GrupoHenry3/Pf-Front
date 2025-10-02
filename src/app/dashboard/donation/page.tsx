"use client";
import DonationForm from '@/components/donations/donation-form';

export default function DonationsPage() {

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <DonationForm  />
    </div>
  );
}