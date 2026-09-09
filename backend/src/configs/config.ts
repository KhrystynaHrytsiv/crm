import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

interface IConfig{
    MONGO_URI:string,
    PORT:string,
}

export const config:IConfig = {
    MONGO_URI: process.env.MONGO_URI!,
    PORT: process.env.PORT!,
}


