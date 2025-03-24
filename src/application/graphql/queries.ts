import { gql } from '@apollo/client';

export const UPLOAD_IMAGE = gql`
  mutation UploadImage {
    uploadImage
  }
`;

export const PAGINATED_LISTINGS = gql`
  query PaginatedListings(
    $page: Int = 1, 
    $limit: Int = 10, 
    $city: String, 
    $rooms: Float, 
    $startDate: DateTime, 
    $endDate: DateTime, 
    $userId: String, 
    $priceMin: Float, 
    $priceMax: Float
  ) {
    paginatedListings(
      page: $page, 
      limit: $limit, 
      city: $city, 
      rooms: $rooms, 
      startDate: $startDate, 
      endDate: $endDate, 
      userId: $userId, 
      priceMin: $priceMin, 
      priceMax: $priceMax
    ) {
      listings {
        _id
        title
        description
        price
        city
        district
        rooms
        area
        images
        reviews {
          userId
          comment
          rating
        }
        averageRating
      }
      totalPages
      currentPage
      totalCount
      totallistingCount
    }
  }
`;


export const GET_USER_LISTINGS = gql`
  query GetUserListings($userId: String!) {
    getUserListings(userId: $userId) {
      _id
      title
      description
      price
      city
      district
      rooms
      area
      images
      reviews {
        userId
        comment
        rating
      }
      averageRating
    }
  }
`;


export const SEARCH_LISTINGS = gql`
  query SearchListings($page: Int = 1, $limit: Int = 10, $title: String, $city: String, $priceMin: Float, $priceMax: Float) {
    searchListings(page: $page, limit: $limit, title: $title, city: $city, priceMin: $priceMin, priceMax: $priceMax) {
      items {
        id
        title
        city
        price
      }
      totalCount
    }
  }
`;

export const CREATE_LISTING = gql`
  mutation CreateListing($data: CreateListingDto!) {
    createListing(data: $data) {
      id
      title
      city
      price
    }
  }
`;

export const GET_LISTING_BY_ID = gql`
  query GetListing($id: String!) {
    getListing(id: $id) {
      _id
      title
      description
      price
      city
      district
      DateofPublication
      rooms
      area
      images
      reviews {
        userId
        comment
        rating
      }
      userId {
        _id
        name
        email
      }
      averageRating
    }
  }
`;


export const UPDATE_LISTING = gql`
  mutation UpdateListing($_id: String!, $data: UpdateListingDto!) {
    updateListing(_id: $_id, data: $data) {
      title
      city
      price
    }
  }
`;

export const DELETE_LISTING = gql`
  mutation DeleteListing($id: String!) {
    deleteListing(id: $id)
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($listingId: String!, $comment: String!, $rating: Float!) {
    addReview(listingId: $listingId, comment: $comment, rating: $rating) {
      id
      title
    }
  }
`;

export const UPLOAD_IMAGES = gql`
  mutation UploadImages($files: [Upload!]!) {
    uploadImages(files: $files)
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      id
      name
      email

    }
  }
`;

export const ADD_FAVORITE = gql`
mutation AddFavorite($listingId: ObjectID!) {
  addFavorite(listingId: $listingId) {
    _id

  }
}
`;

export const UNFAVORITE_LISTING = gql`
mutation RemoveFavorite($listingId: ObjectID!) {
  removeFavorite(listingId: $listingId) {
    _id

  }
}
`;

export const GET_FAVORITE = gql`
query GetFavorite( $listingId: ObjectID!) {
  getFavorite(listingId: $listingId) {
    _id

  }
}
`;

export const GET_FAVORITES = gql`
  query GetFavorites {
    getFavorites {
      _id

    }
  }
`;


export const REGISTER_USER = gql`
  mutation Register($data: RegisterInputDto!) {
    register(data: $data) {
      accessToken
    }
  }
`;

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      user {
        _id
        name
        email
        ERoles
        EUserType
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      _id
      name
      email
    }
  }
`;

