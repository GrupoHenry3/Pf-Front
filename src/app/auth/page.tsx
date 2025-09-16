"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/forms/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/interfaces/User";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const handleLogin = (user: User, isLogin: boolean) => {
    try {
      if (isLogin) {
        // Login: correo o nombre de usuario
        login(user.email, user.password);
        router.push("/dashboard/adopter"); // redirige solo en login
      } else {
        // Registro
        register(user);
        alert("Cuenta creada con éxito 🎉");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBack = () => router.push("/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <AuthForm onLogin={(user, isLogin) => handleLogin(user, isLogin)} onBack={handleBack} />
    </div>
  );
}
