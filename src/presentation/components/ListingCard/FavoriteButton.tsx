/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useMutation } from '@apollo/client';
import { ADD_FAVORITE, UNFAVORITE_LISTING } from '@/application/graphql/queries';
import { useState } from 'react';

const FavoriteButton = ({ listingId }: any) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteListing] = useMutation(ADD_FAVORITE);
  const [unfavoriteListing] = useMutation(UNFAVORITE_LISTING);

  const handleFavorite = async () => {
    if (isFavorited) {
      await unfavoriteListing({ variables: { listingId } });
      setIsFavorited(false);
    } else {
      await favoriteListing({ variables: { listingId } });
      setIsFavorited(true);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`mt-4 px-4 py-2 rounded-md ${isFavorited ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
    >
      {isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
    </button>
  );
};

export default FavoriteButton;
