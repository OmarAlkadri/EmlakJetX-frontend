/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { CREATE_LISTING, UPDATE_LISTING, GET_LISTING_BY_ID } from "@/application/graphql/queries";
import ImageUpload from "@/presentation/components/ListingCard/ImageUpload";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/contexts/AuthContext";

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
}

const ListingForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>();
  const { user } = useAuth();

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


    }
    if (!listingId) {
      reset();
    }
  }, [listingId, data, setValue, reset]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return [];

    const uploadedUrls: string[] = [];
    setLoading(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data?.url) {
          uploadedUrls.push(data.url);
        }
      }
    } catch (err) {
      console.error('Error uploading images:', err);
    } finally {
      setLoading(false);
    }

    return uploadedUrls;
  };

  const onSubmit = async (formData: ListingFormData) => {
    const images = await handleUpload()
    const sanitizedData = {
      title: formData.title,
      DateofPublication: new Date(),
      description: formData.description,
      price: Number(formData.price),
      city: formData.city,
      district: formData.district,
      rooms: Number(formData.rooms),
      area: Number(formData.area),
      images: images || [],
      reviews: formData.reviews?.map(({ userId, comment, rating }) => ({
        userId,
        comment,
        rating: Number(rating),
      })) || [],
      userId: String(user?._id),
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


  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">
          {listingId ? "Edit Listing" : "New Listing"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "title", type: "text" },
            { name: "description", type: "text" },
            { name: "price", type: "number" },
            { name: "city", type: "text" },
            { name: "district", type: "text" },
            { name: "rooms", type: "number" },
            { name: "area", type: "number" },
          ].map(({ name, type }) => (
            <div key={name}>
              <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </label>
              <input
                id={name}
                type={type}
                {...register(name as keyof ListingFormData, { required: `${name} is required` })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              />
              {errors[name as keyof ListingFormData] && (
                <span className="text-red-500 text-sm">{(errors[name as keyof ListingFormData] as any)?.message}</span>
              )}
            </div>
          ))}
        </div>

        <ImageUpload setSelectedFiles={setSelectedFiles} selectedFiles={selectedFiles} />

        <button
          type="submit"
          className={`text-white w-full px-5 py-2.5 text-center font-medium rounded-lg text-sm focus:outline-none ${createLoading || updateLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"}`}
          disabled={createLoading || updateLoading || loading}
        >
          {listingId ? (updateLoading ? "Updating..." : "Update Listing") : (createLoading ? "Submitting..." : "Create Listing")}
        </button>

        {(createError || updateError) && <p className="text-red-500 text-center mt-2">{createError?.message || updateError?.message}</p>}
      </form>
    </div>
  );

};

export default ListingForm;
