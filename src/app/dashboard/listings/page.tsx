/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useLazyQuery, useQuery } from '@apollo/client';
import { PAGINATED_LISTINGS } from '@/application/graphql/queries';
import ListingCard from '@/presentation/components/ListingCard/ListingCard';
import { useAuth } from '@/contexts/AuthContext';
import { listingCard } from '@/utils/types';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import UnifiedInputComponent from '@/presentation/components/common/unifiedInputComponent';

const ListingsPage = () => {
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [city, setCity] = useState('');
  const [rooms, setRooms] = useState<number | undefined>();

  const [allFilters, setAllFilters] = useState<any[]>([]);

  const [fetchListings, { data, loading, networkStatus }] = useLazyQuery(PAGINATED_LISTINGS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = data?.paginatedListings.totalPages || 0;

    if (totalPages > 0) {
      pages.push(1);
    }

    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };


  useEffect(() => {
    fetchListings({
      variables: {
        priceMin: parseFloat(priceMin) || null,
        priceMax: parseFloat(priceMax) || null,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        city,
        rooms,
        page: currentPage,
        limit: 10,
      },
    });
  }, [priceMin, priceMax, startDate, endDate, city, rooms, currentPage, fetchListings]);


  const handleDateRangeSubmit = (selectedOption: any, customValue?: any) => {
    if (selectedOption) {
      const { startDate, endDate, country, rooms, priceMin, priceMax } = selectedOption;

      setStartDate(startDate)
      setEndDate(endDate);
      setCity(country);
      setRooms(parseInt(rooms) ?? undefined);
      setPriceMin(priceMin);
      setPriceMax(priceMax);

      let newFilter = [];

      if (startDate && endDate) {
        newFilter.push({ label: "startDate", value: [startDate, endDate], type: "dateRange" });
      }
      if (country) {
        newFilter.push({ label: "country", value: country });
      }
      if (rooms) {
        newFilter.push({ label: "rooms", value: rooms });
      }
      if (priceMin !== undefined) {
        newFilter.push({ label: "priceMin", value: priceMin });
      }
      if (priceMax !== undefined) {
        newFilter.push({ label: "priceMax", value: priceMax });
      }

      setAllFilters(newFilter);
    }
  };


  const handleRemoveFilter = (index: number) => {
    const filterToRemove = allFilters[index];

    if (filterToRemove?.label === "startDate" || filterToRemove?.label === "endDate") {
      setStartDate(null);
      setEndDate(null);
    } else if (filterToRemove?.label === "country") {
      setCity('');
    } else if (filterToRemove?.label === "rooms") {
      setRooms(undefined);
    } else if (filterToRemove?.label === "priceMin") {
      setPriceMin('');
    } else if (filterToRemove?.label === "priceMax") {
      setPriceMax('');
    }

    setAllFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
  };
  useEffect(() => {
    renderFilters();
  }, [allFilters]);

  const renderFilters = () => {
    return allFilters.map((filter, index) => {
      if (!filter || !filter.label || !filter.value || !filter?.value?.[0]) {
        return null;
      }

      let label = '';
      if (filter.type === "dateRange")
        label = `${filter.type}: from ${filter?.value?.[0]?.toLocaleDateString() ?? ''} to ${filter?.value?.[1]?.toLocaleDateString() ?? ''}`;
      else
        label = `${filter.label}:  ${filter.value}`;

      return (
        <div
          key={`${filter.label}-${index}`}
          className="font-sans text-sm font-semibold text-slate-900 bg-blue-100/50 border-2 rounded-xl shadow-sm border-blue-400"
        >
          <div className="flex group p-1 pl-1 w-full justify-between">
            <div className="flex pl-1 pr-1 text-cyan-900">
              {label}
            </div>
            <div onClick={() => handleRemoveFilter(index)} className="flex items-center w-4 rounded-md cursor-pointer">
              <svg className="fill-current h-4 w-4" role="button" viewBox="0 0 20 20">
                <path d="M14.348,14.849c-0.469,0.469-1.229,0.469-1.697,0L10,11.819l-2.651,3.029c-0.469,0.469-1.229,0.469-1.697,0
                    c-0.469-0.469-0.469-1.229,0-1.697l2.758-3.15L5.651,6.849c-0.469-0.469-0.469-1.228,0-1.697s1.228-0.469,1.697,0L10,8.183
                    l2.651-3.031c0.469-0.469,1.228-0.469,1.697,0s0.469,1.229,0,1.697l-2.758,3.152l2.758,3.15
                    C14.817,13.62,14.817,14.38,14.348,14.849z" />
              </svg>
            </div>
          </div>
        </div>
      );
    })
  }

  const DateRangeOptions = [
    { label: "Last 7 Days", name: "last7Days" },
    { label: "Last 30 Days", name: "last30Days" },
    { label: "This Month", name: "thisMonth" },
    { label: "Custom Date Range", name: "customRange" }
  ];
  const handlePageChange = (page: number | string) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
    }
  };
  return (
    <div className='flex'>
      <UnifiedInputComponent
        title="Date Range"
        type="radio"
        selectedOption={[]}
        options={DateRangeOptions}
        onSubmit={handleDateRangeSubmit}
        enableCustomField={true}
        additionalFields={true}
      />
      <div className='flex flex-col justify-start pb-4 mb-5 pl-5 pr-4 h-full w-full'>
        <div className="flex justify-between items-center w-full gap-x-2 pb-6">
          <div className="flex items-start min-w-24">Toplam İlanlar: {data?.paginatedListings?.totallistingCount || 0}</div>
          <div className="flex flex-wrap gap-x-2 gap-y-2 items-center justify-start grow">{renderFilters()}</div>
        </div>
        <div className="h-full w-full">
          <div className="w-full flex justify-center items-center">
            <div className="grid grid-cols-3 gap-4 max-w-[1000px] flex-1">

              {loading ? <p className="text-center text-gray-500">Loading...</p> :
                (
                  data?.paginatedListings.listings.map((listing: listingCard) => (
                    <ListingCard key={listing._id} listingCard={listing} />
                  ))
                )
              }

            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-6">
          <div className="flex gap-2">
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ListingsPage;