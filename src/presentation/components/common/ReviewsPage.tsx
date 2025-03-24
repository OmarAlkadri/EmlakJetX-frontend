/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import ReviewList from "./ReviewList";
import Loader from "@/presentation/components/common/Loader";
import { Review, Comment } from "@/utils/types";

interface ReviewsPageProps {
  data: Review[] | undefined;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ data }) => {
  const getFormattedData = (): any[] => {
    if (!data || data.length === 0) return [];

    const groupedComments: {
      oneStar: string[],
      twoStars: string[],
      threeStars: string[],
      fourStars: string[],
      fiveStars: string[],
    } = {
      oneStar: [],
      twoStars: [],
      threeStars: [],
      fourStars: [],
      fiveStars: [],
    };

    data.forEach((review) => {
      const comment: Comment = {
        text: review.comment,
        user: review.userId,
        timestamp: new Date().toISOString(),
      };

      switch (Math.round(review.rating)) {
        case 1:
          groupedComments.oneStar.push(comment.text);
          break;
        case 2:
          groupedComments.twoStars.push(comment.text);
          break;
        case 3:
          groupedComments.threeStars.push(comment.text);
          break;
        case 4:
          groupedComments.fourStars.push(comment.text);
          break;
        case 5:
          groupedComments.fiveStars.push(comment.text);
          break;
        default:
          break;
      }
    });

    return [
      {
        formattedSuggestions: [],
        tourismDetails: [],
        comments: groupedComments,
      },
    ];
  };

  const reviewsData = getFormattedData();

  return (
    <Loader loaded={true} onlySpinner={false}>
      <div className="w-full px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
          <div className="w-full flex-col justify-center items-start gap-8 flex">
            <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
              <h1 className="font-manrope text-gray-400 text-4xl font-bold leading-10 relative left-0">
                Reviews
              </h1>
              <hr className="w-28 h-1 bg-black border-0 rounded dark:bg-gray-700" />
            </div>
            <div className="flex lg:flex-row w-full flex-col">
              <div className="reviews px-4 md:px-5 lg:px-5 mx-auto h-full w-full max-w-[600px]">
                <div className="relative right-4">Listing Reviews</div>
                <ol className="relative top-4 border-s border-gray-200 border-dashed dark:border-gray-700">
                  {reviewsData.length > 0 ? (
                    <ReviewList reviews={reviewsData} />
                  ) : (
                    <li className="text-gray-500 italic">No reviews available.</li>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loader>
  );
};

export default ReviewsPage;
