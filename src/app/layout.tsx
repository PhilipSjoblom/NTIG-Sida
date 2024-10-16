import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
    title: "We Love NTIG",
    description: "NTI Gymnasium Södertörn",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
