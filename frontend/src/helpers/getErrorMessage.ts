import axios from "axios";

export const getErrorMessage = (e: unknown): string => {
    if (typeof e === "string") {
        return e;
    }
    if (axios.isAxiosError(e)) {
        return e.response?.data?.message || e.message;
    }
    if (e instanceof Error) {
        return e.message;
    }
    return "Something went wrong";
};