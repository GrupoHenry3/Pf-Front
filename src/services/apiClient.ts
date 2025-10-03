import axios from "axios";
import { getApiUrl } from "@/config/environment";

export const apiClient = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});
