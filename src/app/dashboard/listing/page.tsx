/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useEffect, useState } from "react";
import { ADD_REVIEW, GET_LISTING_BY_ID } from "@/application/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import Dialog from "@/presentation/components/common/Dialog";

const ListingDetails = () => {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");
  const { data, loading, error, refetch } = useQuery(GET_LISTING_BY_ID, {
    variables: { id: listingId },
    skip: !listingId,
  });
  const listing = data?.getListing;

  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState(listing?.images);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<any[]>([]);

  useEffect(() => {
    if (listing?.images?.length > 0) {
      setImages(listing.images);
      setMainImage(listing.images[0]);
    }
  }, [listing]);

  if (!listing) return <p>Listing not found.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-8">
      <div className="bg-gray-100 container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img src={mainImage} alt="Product" className="w-full h-auto rounded-lg shadow-md mb-4" />
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {images.map((img: string | undefined, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">{listing.title}</h2>
            <p className="text-gray-600 mb-4">{listing.city}, {listing.district}</p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < listing.averageRating ? "currentColor" : "gray"}
                  className="size-6 text-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">{listing.averageRating} ({listing.reviews.length} reviews)</span>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">${listing.price}</span>
            </div>
            <p className="text-gray-700 mb-6">{listing.description}</p>
            <div className="flex space-x-4 mb-6">
              <button onClick={() => setReviewDialogOpen(true)} className="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700">Yorum Ekle</button>
              <button onClick={() => { setSelectedReviews(listing.reviews); setDialogOpen(true); }} className="bg-gray-200 flex gap-2 items-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">Yorumları Gör</button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Listing Details:</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Area: {listing.area} m²</li>
                <li>Rooms: {listing.rooms}</li>
                <li>Posted on: {new Date(listing.DateofPublication).toLocaleDateString()}</li>
                <li>Owner: {listing.userId.name} ({listing.userId.email})</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {dialogOpen && selectedReviews && (
        <Dialog
          position={{ content: 'center', items: 'start' }}
          templete={<ReviewsPage data={selectedReviews} />}
          onClose={() => setDialogOpen(false)}
          width="md"
          height="xl"
        />
      )}

      {reviewDialogOpen && (
        <Dialog
          position={{ content: 'center', items: 'start' }}
          templete={<AddReviewForm listingId={listingId} onClose={() => setReviewDialogOpen(false)} refetch={refetch} />}
          onClose={() => setReviewDialogOpen(false)}
          width="md"
          height="lg"
        />
      )}
    </div>
  );
};



export const ReviewsPage = ({ data }: { data: any[] }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Yorumlar</h2>
      {data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((review, index) => (
            <li key={index} className="border-b pb-4">
              <p className="text-gray-900 font-semibold">Kullanıcı: {review.userId}</p>
              <p className="text-yellow-500">
                {"⭐".repeat(review.rating)} ({review.rating}/5)
              </p>
              <p className="text-gray-700">Yorum: "{review.comment}"</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Henüz yorum yapılmamış.</p>
      )}
    </div>
  );
};

export const AddReviewForm = ({ listingId, onClose, refetch }: { listingId: string | null; onClose: () => void; refetch: () => void }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addReview({ variables: { listingId, rating, comment } });
    refetch();
    onClose();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Yorum Ekle</h2>
      {error && <p className="text-red-500">Hata: {error.message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Puan (1-5)</span>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Yorum</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="block w-full mt-1 p-2 border rounded"
          ></textarea>
        </label>
        <div className="flex space-x-4">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            Gönder
          </button>
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};


export default ListingDetails;