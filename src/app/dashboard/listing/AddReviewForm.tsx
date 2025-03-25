/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ADD_REVIEW } from "@/application/graphql/queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";

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
