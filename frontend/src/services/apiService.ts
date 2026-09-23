import axios from "axios";
const baseURL = `http://localhost:4000`;
export const api = axios.create({baseURL});
api.interceptors.request.use((config) =>{
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})