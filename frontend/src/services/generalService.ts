import { api } from "./apiService";

export const generalService = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await api.get<T>(endpoint);
        return response.data;
    },
};
