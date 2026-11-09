import dotenv from "dotenv";

dotenv.config({ path: ".env", quiet: true });

const required = [
    "MONGO_URI",
    "PORT",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_LIFETIME",
    "JWT_REFRESH_LIFETIME",
    "JWT_ACTIVATE_SECRET",
    "JWT_RECOVERY_SECRET",
    "JWT_ACTIVATE_LIFETIME",
    "JWT_RECOVERY_LIFETIME",
    "FRONTEND_URL",
] as const;

// Fail fast on startup instead of breaking on the first request
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

interface IConfig {
    NODE_ENV: string;
    MONGO_URI: string;
    PORT: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_LIFETIME: any;
    JWT_REFRESH_LIFETIME: any;
    JWT_ACTIVATE_SECRET: string;
    JWT_RECOVERY_SECRET: string;
    JWT_ACTIVATE_LIFETIME: any;
    JWT_RECOVERY_LIFETIME: any;
    FRONTEND_URL: string;
    DNS_SERVERS: string[];
    TRUST_PROXY: number;
}

export const config: IConfig = {
    NODE_ENV: process.env.NODE_ENV || "development",
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
    FRONTEND_URL: process.env.FRONTEND_URL!,
    // Optional: custom DNS for mongodb+srv when the local resolver can't resolve SRV records
    DNS_SERVERS: (process.env.DNS_SERVERS || "")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean),
    // Number of reverse proxies in front of the app (needed for correct client IP in rate limiting)
    TRUST_PROXY: Number(process.env.TRUST_PROXY) || 0,
};
