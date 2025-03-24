/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '@/application/graphql/queries';

const ReviewForm = ({ listingId }: { listingId: string }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [addReview] = useMutation(ADD_REVIEW);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    await addReview({ variables: { listingId, comment, rating } });
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="border p-2 w-full"
        placeholder="أضف تعليقك..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 w-20"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">إرسال</button>
    </form>
  );
};

export default ReviewForm;
