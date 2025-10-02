"use client";
import DonationForm from '@/components/donations/donation-form';
import { useRouter } from "next/navigation"; 

import { useState } from 'react';

export default function DonationsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push('/'); // Redirige a la página principal si está en el primer paso
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <DonationForm step={step} onNext={handleNext} onBack={handleBack} />
    </div>
  );
}