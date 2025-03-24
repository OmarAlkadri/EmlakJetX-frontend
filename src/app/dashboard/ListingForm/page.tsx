/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { CREATE_LISTING, UPDATE_LISTING, GET_LISTING_BY_ID } from "@/application/graphql/queries";
import ImageUpload from "@/presentation/components/ListingCard/ImageUpload";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface Review {
  userId: string;
  comment: string;
  rating: number;
}

export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  city: string;
  district: string;
  rooms: number;
  area: number;
  images: string[];
  reviews: Review[];
  userId: any;
  DateofPublication: Date | null;
}

const ListingForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ListingFormData>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_LISTING_BY_ID, {
    variables: { id: listingId },
    skip: !listingId,
  });

  const [createListing, { loading: createLoading, error: createError }] = useMutation(CREATE_LISTING);
  const [updateListing, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_LISTING);

  useEffect(() => {
    if (data?.getListing && listingId) {
      Object.keys(data.getListing).forEach((key) => {
        setValue(key as keyof ListingFormData, data.getListing[key]);
      });

      if (data.getListing.DateofPublication) {
        setValue("DateofPublication", new Date(data.getListing.DateofPublication));
      }
    }
    if (!listingId) {
      reset();
    }
  }, [listingId, data, setValue]);

  const onSubmit = async (formData: ListingFormData) => {
    const sanitizedData = {
      title: formData.title,
      DateofPublication: formData.DateofPublication,
      description: formData.description,
      price: formData.price,
      city: formData.city,
      district: formData.district,
      rooms: formData.rooms,
      area: formData.area,
      images: formData.images || [],
      reviews: formData.reviews?.map(({ userId, comment, rating }) => ({
        userId: userId,
        comment,
        rating,
      })) || [],
      userId: formData.userId?._id || formData.userId,
    };

    try {
      if (listingId) {
        await updateListing({ variables: { _id: listingId, data: sanitizedData } });
      } else {
        await createListing({ variables: { data: sanitizedData } });
      }
      reset();
      router.replace("/dashboard/admin");
    } catch (err) {
      console.error("Error saving listing:", err);
    }
  };


  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p className="text-red-500">Error loading listing</p>;

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">
          {listingId ? "Edit Listing" : "New Listing"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["title", "description", "price", "city", "district", "rooms", "area"].map((name) => (
            <div key={name}>
              <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </label>
              <input
                id={name}
                type="text"
                {...register(name as keyof ListingFormData, { required: `${name} is required` })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              />
              {errors[name as keyof ListingFormData] && (
                <span className="text-red-500 text-sm">{(errors[name as keyof ListingFormData] as any)?.message}</span>
              )}
            </div>
          ))}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Publication</label>
            <DatePicker
              selected={getValues("DateofPublication")}
              onChange={(date) => setValue("DateofPublication", date)}
              className="border rounded px-3 py-2 w-full"
              isClearable
              placeholderText="Tarih seçin"
            />
          </div>
        </div>

        <ImageUpload onUpload={(uploadedImages) => setValue("images", uploadedImages)} />

        <button
          type="submit"
          className={`text-white w-full px-5 py-2.5 text-center font-medium rounded-lg text-sm focus:outline-none ${createLoading || updateLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"}`}
          disabled={createLoading || updateLoading}
        >
          {listingId ? (updateLoading ? "Updating..." : "Update Listing") : (createLoading ? "Submitting..." : "Create Listing")}
        </button>

        {(createError || updateError) && <p className="text-red-500 text-center mt-2">{createError?.message || updateError?.message}</p>}
      </form>
    </div>
  );
};

export default ListingForm;
