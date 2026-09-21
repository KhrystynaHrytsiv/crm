import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

interface IConfig{
    MONGO_URI:string,
    PORT:string,
    JWT_ACCESS_SECRET: string,
    JWT_REFRESH_SECRET: string,
    JWT_ACCESS_LIFETIME: any,
    JWT_REFRESH_LIFETIME: any,
    JWT_ACTIVATE_SECRET: string,
    JWT_RECOVERY_SECRET: string,
    JWT_ACTIVATE_LIFETIME: any,
    JWT_RECOVERY_LIFETIME: any,
    FRONTEND_URL:string,
}

export const config:IConfig = {
    MONGO_URI: process.env.MONGO_URI!,
    PORT: process.env.PORT!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_LIFETIME: process.env.JWT_ACCESS_LIFETIME!,
    JWT_REFRESH_LIFETIME: process.env.JWT_REFRESH_LIFETIME!,
    JWT_ACTIVATE_SECRET: process.env.JWT_ACTIVATE_SECRET!,
    JWT_RECOVERY_SECRET: process.env.JWT_RECOVERY_SECRET!,
    JWT_ACTIVATE_LIFETIME: process.env.JWT_ACTIVATE_LIFETIME!,
    JWT_RECOVERY_LIFETIME: process.env.JWT_RECOVERY_LIFETIME!,
    FRONTEND_URL: process.env.FRONTEND_URL!
}


