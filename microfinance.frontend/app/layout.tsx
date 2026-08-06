import type { Metadata } from "next";
import "./globals.css";
import { MicrofinanceProvider } from "./context/MicrofinanceContext";
import { AppLayout } from "./components/layout/AppLayout";
import { SmsToastSimulator } from "./components/ui/SmsToastSimulator";

export const metadata: Metadata = {
  title: "TechStdio NGO Microfinance Management OS | Centralized Core Banking",
  description:
    "Next-Generation Centralized NGO Microfinance Banking OS with biometric fingerprint transaction verification, dynamic product rules, multi-branch control, and automated SMS alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
        <MicrofinanceProvider>
          <AppLayout>
            {children}
            <SmsToastSimulator />
          </AppLayout>
        </MicrofinanceProvider>
      </body>
    </html>
  );
}
