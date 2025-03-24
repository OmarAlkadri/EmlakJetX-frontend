/* eslint-disable react/no-children-prop */
"use client";
import "./globals.css";
import React from 'react';

import Providers from "./provider";
import DashboardLayout from "@/presentation/components/layouts/DashboardLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`flex flex-col w-full h-screen bg-white dark:bg-black antialiased`}>
        <Providers>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </Providers>
      </body>
    </html>
  )
}
