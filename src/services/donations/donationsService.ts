import { apiClient } from "../apiClient";

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
    const response = await apiClient.post<CreateDonationResponse>(
      "/donations",
      payload
    );
    return response.data;
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
