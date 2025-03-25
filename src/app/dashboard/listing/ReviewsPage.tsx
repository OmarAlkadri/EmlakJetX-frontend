/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
                            <p className="text-gray-700">Yorum: {review.comment}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">Henüz yorum yapılmamış.</p>
            )}
        </div>
    );
};
