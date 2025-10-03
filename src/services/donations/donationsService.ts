import { apiClient } from "../apiClient";
import toast from "react-hot-toast";

interface CreateDonationPayload {
  amount: number;
  message?: string;
  shelterID: string;
}

interface CreateDonationResponse {
  sessionUrl: string;
  sessionId: string; // 👈 ahora coincide con backend
}

export const donationsService = {
  createDonation: async (
    payload: CreateDonationPayload
  ): Promise<CreateDonationResponse> => {
    try {
      const response = await apiClient.post<CreateDonationResponse>(
        "/donations",
        payload
      );
      toast.success("Procesando donación...");
      return response.data;
    } catch (error) {
      toast.error("Error al procesar la donación");
      throw error;
    }
  },

  getAll: async () => {
    const response = await apiClient.get("/donations");
    return response.data;
  },

  findByShelter: async () => {
    const response = await apiClient.get(`/donations/shelter`);
    return response.data;
  },

  findByUser: async () => {
    const response = await apiClient.get(`/donations/user`);
    return response.data;
  },
};
