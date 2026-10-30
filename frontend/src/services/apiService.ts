import axios, { AxiosError } from "axios";

import { authService } from "./authService";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;
let isRefreshing = false;
export const api = axios.create({ baseURL });
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (
            originalRequest.url === "/auth/refresh" ||
            originalRequest.url === "/auth/login" ||
            originalRequest.url === "/auth/logout"
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeToWaitList((refreshError) => {
                    if (refreshError) {
                        reject(refreshError);
                        return;
                    }
                    const accessToken = localStorage.getItem("accessToken");
                    if (accessToken) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }

                    api(originalRequest).then(resolve).catch(reject);
                });
            });
        }

        isRefreshing = true;

        try {
            await authService.refresh();
            runAfterRefresh();
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return await api(originalRequest);
        } catch (refreshError) {
            runAfterRefresh(refreshError);
            await authService.deleteTokenFromLS();
            window.location.replace("/login?SessionExpired=true");
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

type IWaitList = (error?: unknown) => void;

const waitList: IWaitList[] = [];

const subscribeToWaitList = (cb: IWaitList): void => {
    waitList.push(cb);
};

const runAfterRefresh = (error?: unknown): void => {
    while (waitList.length) {
        const cb = waitList.shift();
        cb?.(error);
    }
};
