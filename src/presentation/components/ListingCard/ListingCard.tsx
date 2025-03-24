/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useMutation, useLazyQuery } from '@apollo/client';
import { UNFAVORITE_LISTING, GET_FAVORITE, ADD_FAVORITE } from '@/application/graphql/queries';
import { listingCard } from '../../../utils/types';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAuth } from '@/contexts/AuthContext';

interface ListingCardProps {
  listingCard: listingCard;
}

const ListingCard: React.FC<ListingCardProps> = ({ listingCard }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [getFavorite, { data }] = useLazyQuery(GET_FAVORITE, {
    variables: { listingId: listingCard._id },
  });

  const [unfavoriteListing] = useMutation(UNFAVORITE_LISTING);
  const [favoriteListing] = useMutation(ADD_FAVORITE);

  const handleFavorite = async () => {
    await favoriteListing({ variables: { listingId: listingCard._id } });
    getFavorite();
  };

  const handleUnfavorite = async () => {
    await unfavoriteListing({ variables: { listingId: listingCard._id } });
    getFavorite();
  };

  return (
    <div key={`${listingCard._id}`} className="flex max-w-full h-[190px] mb-4">
      <div className="flex flex-col h-full w-[255.85px] duration-500 hover:scale-105 hover:shadow-xl">
        <div className="flex items-center h-[143px] justify-center group backdrop-opacity-100">
          <img
            src={"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080" ?? listingCard.images[0]}
            alt="image"
            className="relative w-full h-[143px] object-cover"
          />
          <div className="absolute hidden items-center bg-gradient-to-t from-black w-full h-full group-hover:flex transform duration-500 top-0">
            <div className="flex justify-center w-full justify-evenly">
              <div
                className="flex flex-col hover:scale-105 group/detail cursor-pointer items-center justify-center"
                onClick={() => {
                  if (data?.getFavorite?._id?.toString() === listingCard._id?.toString()) {
                    handleUnfavorite();
                  } else {
                    handleFavorite();
                  }
                }}
              >
                <Icon
                  icon={data?.getFavorite?._id?.toString() === listingCard._id?.toString() ? 'material-symbols-light:favorite-rounded' : 'material-symbols-light:favorite-outline-rounded'}
                  width="30"
                  height="30"
                  style={{ color: '#e15151' }}
                  onClick={() => {
                    if (data?.getFavorite?._id?.toString() === listingCard._id?.toString()) {
                      handleUnfavorite();
                    } else {
                      handleFavorite();
                    }
                  }}
                />
                <p className="text-slate-300 font-[Eudoxus_Sans] text-[12px] font-medium group-hover/detail:text-white">
                  {data?.getFavorite?._id?.toString() === listingCard._id?.toString()
                    ? 'Remove from Favorite'
                    : 'Add to Favorite'}
                </p>
              </div>
              <div
                className="flex flex-col hover:scale-105 group/detail cursor-pointer items-center justify-center"
                onClick={() => router.push(`/dashboard/listing?id=${listingCard._id}`)}
              >
                <svg className="w-7 h-7 group-hover/detail:fill-white" xmlns="http://www.w3.org/2000/svg" width={768} height={768} fill="#dedede" viewBox="0 0 24 24">
                  <path d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"></path>
                </svg>
                <p className="text-slate-300 font-[Eudoxus_Sans] text-[12px] font-medium group-hover/detail:text-white">
                  View Details
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start p-1 pb-2 w-full h-full font-[Eudoxus_Sans] text-[12px] font-medium leading-[15.12px]">
          <div>
            <div className="flex pb-2">{listingCard.title}</div>
            <div className="flex items-start w-full gap-x-4 font-[Eudoxus_Sans] text-[10px] font-normal leading-[12.6px]">
              <div>{listingCard.district}, {listingCard.city} - {listingCard.area} m²</div>
            </div>
          </div>
          <div
            className="cursor-pointer flex items-center h-full group/download hover:fill-blue-500"
            onClick={() => router.push(`/dashboard/listing/${listingCard._id}`)}
          >
            <svg className="w-6 h-6 group-hover/download:fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" fill="black" viewBox="0 0 20 20">
              <path d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"></path>
              <path d="M15 9h-4V1H9v8H5l5 6z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
