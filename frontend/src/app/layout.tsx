import type {Metadata} from "next";
import "./globals.css";
import ReduxProvider from "../redux/ReduxProvider";


export const metadata: Metadata = {
  title: "CRM Programming School",
  description: "CRM for processing student applications",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
      <ReduxProvider>
        {children}
      </ReduxProvider>
      </body>
    </html>
  );
}
