import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boxing Manager",
  description: "Управление бойцами и спортивной карьерой",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {user && (
          <header className="border-b border-zinc-800 bg-[#0a0a0a]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef4444] text-lg font-bold text-white">
                  E
                </div>

                <h1 className="text-lg font-semibold text-white">
                  Boxing Manager
                </h1>
              </div>

              <LogoutButton />
            </div>
          </header>
        )}

        {children}
      </body>
    </html>
  );
}
