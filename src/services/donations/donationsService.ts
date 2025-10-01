import { apiClient } from "../apiClient";

interface CreateDonationPayload {
  amount: number;
  message?: string;
  shelterID: string;
  userID: string;
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

  getMyDonations: async () => {
    const response = await apiClient.get("/donations/my");
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get("/donations");
    return response.data;
  },
};
