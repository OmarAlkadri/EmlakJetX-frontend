/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { JSX, useEffect } from 'react';
import { AboutUs } from '@/presentation/components/common/aboutUs';
import { Footer } from '@/presentation/components/common/footer';
import { useLazyQuery } from '@apollo/client';
import { PAGINATED_LISTINGS } from '@/application/graphql/queries';
import ListingCard from '@/presentation/components/ListingCard/ListingCard';
import { listingCard } from '@/utils/types';
import ListingsPage from './dashboard/listings/page';

export default function HomePage(): JSX.Element {
  const [fetchListings, { data, loading }] = useLazyQuery(PAGINATED_LISTINGS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div>
      <div className="h-full w-full">

        <ListingsPage />

      </div>
      <AboutUs />
      <footer className="bg-gray-200 dark:bg-gray-900">
        <Footer />
      </footer>
    </div>
  );
}
