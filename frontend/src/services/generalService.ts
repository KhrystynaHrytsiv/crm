import { AxiosRequestConfig } from "axios";

import { api } from "./apiService";

export const generalService = {
    get: async <T>(
        endpoint: string,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const response = await api.get<T>(endpoint, config);
        return response.data;
    },
    post: async <T, D>(
        endpoint: string,
        dto: D,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const { data } = await api.post(endpoint, dto, config);
        return data;
    },
    put: async <T, D>(
        endpoint: string,
        dto: D,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const { data } = await api.put<T>(endpoint, dto, config);
        return data;
    },
    patch: async <T>(endpoint: string): Promise<T> => {
        const { data } = await api.patch(endpoint);
        return data;
    },
};
