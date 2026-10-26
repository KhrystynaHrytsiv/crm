import "./globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";

import ReduxProvider from "../redux/ReduxProvider";

export const metadata: Metadata = {
    title: "CRM",
    description: "CRM for processing student applications",
};

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    );
}
