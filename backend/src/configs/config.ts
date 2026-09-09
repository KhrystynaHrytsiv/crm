import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
}


