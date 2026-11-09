import type { NextConfig } from "next";
import path from "path";

// The app imports code from ../shared and ../backend/src/enums, so the project root is the repo root
const repoRoot = path.resolve(__dirname, "..");

const nextConfig: NextConfig = {
    turbopack: {
        root: repoRoot,
    },
    outputFileTracingRoot: repoRoot,
    // Self-contained server for the Docker image (node frontend/server.js)
    output: "standalone",
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
