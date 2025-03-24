"use client";
import React, { JSX } from 'react';
import { AboutUs } from '@/presentation/components/common/aboutUs';
import { Footer } from '@/presentation/components/common/footer';



export default function HomePage(): JSX.Element {



  return (
    <div>

      <AboutUs />
      <footer className="bg-gray-200 dark:bg-gray-900">
        <Footer />
      </footer>
    </div>
  );
}
