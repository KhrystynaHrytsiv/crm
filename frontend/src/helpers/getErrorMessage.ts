import axios from "axios";

export const getErrorMessage = (e: unknown): string => {
    if (axios.isAxiosError(e)) {
        return e.response?.data?.message || e.message;
    }
    return "Something went wrong";
};
