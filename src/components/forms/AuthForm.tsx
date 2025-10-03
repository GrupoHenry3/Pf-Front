"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import AuthHeader from "./AuthHeader";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { LoginFormValues, RegisterFormValues } from "@/validators/loginSchema";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthForm() {
  const { login, register } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [loginFormData, setLoginFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const [registerFormData, setRegisterFormData] = useState<RegisterFormValues>({
    fullName: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const handleLoginChange = (field: keyof LoginFormValues, value: string) => {
    setLoginFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterChange = (field: keyof RegisterFormValues, value: string) => {
    setRegisterFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        await login(loginFormData.email, loginFormData.password);
        router.push("/dashboard");
      } catch {
        // El AuthContext ya mostró el toast de error
        return;
      }
    } else {
      try {
        await register(
          registerFormData.fullName,
          registerFormData.email,
          registerFormData.password,
          registerFormData.confirmedPassword || ""
        );
        setIsLogin(true);
      } catch {
        // El AuthContext ya mostró el toast de error
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-12">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <AuthHeader />
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <Tabs value={isLogin ? "login" : "register"} onValueChange={(val) => setIsLogin(val === "login")}>
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-100 p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-black text-gray-500"
                >
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-black text-gray-500"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isLogin ? (
                <LoginForm formData={loginFormData} onLoginInputsChange={handleLoginChange} />
              ) : (
                <RegisterForm formData={registerFormData} onRegisterChange={handleRegisterChange} />
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O continúa con</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full py-3 rounded-xl border-2"
                size="lg"
                onClick={() => {
                  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
                }}
              >
                {/* ... ícono de Google ... */}
                Continuar con Google
              </Button>

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl" size="lg">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </Button>

              {isLogin && (
                <div className="text-center">
                  <Button variant="link" className="text-green-600 hover:text-green-700">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {!isLogin && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Al registrarte, aceptas nuestros{" "}
            <Button variant="link" className="p-0 h-auto text-green-600 hover:text-green-700">
              Términos de Servicio
            </Button>{" "}
            y{" "}
            <Button variant="link" className="p-0 h-auto text-green-600 hover:text-green-700">
              Política de Privacidad
            </Button>
          </p>
        )}
      </div>
    </div>
  );
}

