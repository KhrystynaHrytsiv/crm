import { IAuth } from "../../../shared/interfaces/IAuth";
import { IToken } from "../../../shared/interfaces/IToken";
import { generalService } from "./generalService";

export const authService = {
    async login(data: IAuth) {
        const response = await generalService.post<{ tokens: IToken }, IAuth>(
            "/auth/login",
            data,
        );
        const { accessToken, refreshToken } = response.tokens;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        return response;
    },
    async logout() {
        const refreshToken = localStorage.getItem("refreshToken");
        try {
            if (refreshToken) {
                await generalService.post(
                    "/auth/logout",
                    {},
                    { headers: { Authorization: `Bearer ${refreshToken}` } },
                );
            }
        } finally {
            await this.deleteTokenFromLS();
        }
    },
    async refresh() {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("Refresh token is missing");
        }
        const { accessToken, refreshToken: newRefresh } =
            await generalService.post<IToken, Record<string, never>>(
                "/auth/refresh",
                {},
                { headers: { Authorization: `Bearer ${refreshToken}` } },
            );
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
    },
    async deleteTokenFromLS() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },
};
