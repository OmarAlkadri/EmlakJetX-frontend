/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useQuery } from '@apollo/client';
import { GET_FAVORITES } from '@/application/graphql/queries';
import ListingCard from '@/presentation/components/ListingCard/ListingCard';
import { listingCard } from '@/utils/types';

const FavoritesPage = () => {
  const { data, loading, error } = useQuery(GET_FAVORITES);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">حدث خطأ أثناء تحميل البيانات.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">الإعلانات المفضلة</h1>

      {data?.getFavorites.length === 0 ? (
        <p className="text-gray-500">لم تقم بإضافة أي إعلانات إلى المفضلة بعد.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data.getFavorites.map((listing: listingCard) => (
            <ListingCard key={listing._id} listingCard={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
