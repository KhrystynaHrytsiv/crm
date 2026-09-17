import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

interface IConfig{
    MONGO_URI:string,
    PORT:string,
    JWT_ACCESS_SECRET: string,
    JWT_REFRESH_SECRET: string,
    JWT_ACCESS_LIFETIME: any,
    JWT_REFRESH_LIFETIME: any,
}

export const config:IConfig = {
    MONGO_URI: process.env.MONGO_URI!,
    PORT: process.env.PORT!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_LIFETIME: process.env.JWT_ACCESS_LIFETIME!,
    JWT_REFRESH_LIFETIME: process.env.JWT_REFRESH_LIFETIME!,
}


