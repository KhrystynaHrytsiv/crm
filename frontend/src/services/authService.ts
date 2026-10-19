import {IAuth} from "../../../shared/interfaces/IAuth";
import {api} from "./apiService";
import {IToken} from "../../../shared/interfaces/IToken";


export const authService = {
    async login (data: IAuth) {
        const response = await api.post('/auth/login', data);
        const {accessToken, refreshToken} = response.data.tokens;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user))
        return response.data;
    },
    async logout (){
        const refreshToken = localStorage.getItem("refreshToken");
        if(refreshToken){
            await api.post('/auth/logout',  {}, {headers: {Authorization: `Bearer ${refreshToken}`}});
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },
    async refresh () {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken){
            throw new Error("Refresh token is missing")
        }
        const {data: {accessToken, refreshToken: newRefresh}}= await api.post<IToken>('/auth/refresh', {}, {headers: {Authorization: `Bearer ${refreshToken}`}});
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefresh)
    },
    async deleteTokenFromLS (){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

};