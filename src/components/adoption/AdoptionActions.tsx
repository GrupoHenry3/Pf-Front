"use client";

import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdoptionActionsProps {
  onStatusUpdate: (status: 'Approved' | 'Rejected', rejectionReason?: string) => Promise<void>;
  isUpdating: boolean;
}

export function AdoptionActions({ onStatusUpdate, isUpdating }: AdoptionActionsProps) {
  const handleApprove = async () => {
    await onStatusUpdate('Approved');
  };

  const handleReject = async () => {
    await onStatusUpdate('Rejected', "Solicitud rechazada por el refugio");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Acciones de la Solicitud
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Revisa cuidadosamente la solicitud antes de tomar una decisión. 
            Una vez aprobada o rechazada, no podrás cambiar el estado.
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={isUpdating}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isUpdating ? "Procesando..." : "Aprobar Adopción"}
            </Button>
            
            <Button
              onClick={handleReject}
              variant="destructive"
              className="flex-1"
              disabled={isUpdating}
            >
              <XCircle className="w-4 h-4 mr-2" />
              {isUpdating ? "Procesando..." : "Rechazar Adopción"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
