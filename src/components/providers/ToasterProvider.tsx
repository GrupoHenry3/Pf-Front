"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        // estilos base
        style: {
          fontSize: "0.95rem",
        },
        // por tipo
        success: { duration: 2000 },
        error: { duration: 4000 },
      }}
    />
  );
}
