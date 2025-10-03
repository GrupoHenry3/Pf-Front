"use client";

import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";


export default function AuthHeader() {
  
  const router = useRouter();
  const onBack = () => router.push("/welcome");
  
  return (
    <div className="mb-8"><Button
        variant="ghost"
        className="mb-4 -ml-4 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button><div className="flex items-center justify-center space-x-2 mb-6">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900">PetAdopt</span>
      </div>
    </div>
  );
}
