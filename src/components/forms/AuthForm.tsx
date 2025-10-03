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
import toast from "react-hot-toast";


export function AuthForm() {

  const {login, register } = useAuth()
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [loginFormData, setLoginFormData] = useState<LoginFormValues>({
    email: "",
    password: ""
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
      try{
        console.log(isLogin)
        await login(loginFormData.email, loginFormData.password)
        router.push("/dashboard");
      }
      catch{
        toast.error("Error al iniciar sesión");
        return;
      }
    }
    else{

      try{
        await register(registerFormData.fullName, registerFormData.email, registerFormData.password, registerFormData.confirmedPassword || "")
        setIsLogin(true);
      }
      catch{
        toast.error("Error al registrar usuario");
        return;
      }
    }
 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-12">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <AuthHeader/>
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <Tabs
              value={isLogin ? "login" : "register"}
              onValueChange={(val) => setIsLogin(val === "login")}
              >
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
                <LoginForm
                  formData={loginFormData}
                  onLoginInputsChange={handleLoginChange}
                />
              ) : (
                <RegisterForm
                  formData={registerFormData}
                  onRegisterChange={handleRegisterChange}
                />
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
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                    1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                    3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 
                    7.28-2.66l-3.57-2.77c-.98.66-2.23 
                    1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                    20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                    8.55 1 10.22 1 12s.43 3.45 1.18 
                    4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 
                    4.21 1.64l3.15-3.15C17.45 2.09 14.97 
                    1 12 1 7.7 1 3.99 3.47 2.18 
                    7.07l3.66 2.84c.87-2.6 
                    3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </Button>


              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
                size="lg"
              >
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
