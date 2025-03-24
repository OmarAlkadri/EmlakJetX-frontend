/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

interface ReviewDetails {
    comments: Record<string, string[]>;
}

interface Props {
    reviews: ReviewDetails[];
}

const ReviewList: React.FC<Props> = ({ reviews }) => {
    return (
        <ul>
            {reviews.map((review, index) => (
                <React.Fragment key={index}>
                    {Object.keys(review.comments).length > 0 && (
                        <li key={`${index}-comments`} className="mb-5 ms-6">
                            <strong className="text-gray-500 dark:text-gray-300">Comments:</strong>
                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                    {Object.entries(review.comments).map(([key, comments]) => (
                                        <div key={key}>
                                            <h4 className="text-gray-600 capitalize">{key}:</h4>
                                            {comments.length > 0 ? (
                                                comments.map((comment, i) => (
                                                    <p key={i} className="ml-4">{comment}</p>
                                                ))
                                            ) : (
                                                <p className="italic text-gray-400">
                                                    No comments available.
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
};

export default ReviewList;
