"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
  onClear: () => void;
}

export function ErrorAlert({ error, onClear }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert className="mb-4 border-red-500 bg-red-50">
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-800">{error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
