import axios from "axios";

 interface LoginData {
    email: string,
    password: string
}

interface RegisterData {
    fullName: string,
    email: string,
    password: string
}

const apiClient = axios.create({
    baseURL: "http://localhost:5500/api",
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authService = {
    login: async (data: LoginData) => {
        const response = await apiClient.post("/auth/signin", data);
        return response.data; 
    },
    register: async (data: RegisterData) => {
        const response = await apiClient.post("/auth/signup", data);
        return response.data; 
    },
    logout: async () => {
        const response = await apiClient.post("/auth/logout");
        return response.data;
    }
}