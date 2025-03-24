/* eslint-disable @typescript-eslint/no-explicit-any */
export interface listingCard {
  _id: string
  title: string
  description: string
  price: number
  city: string
  district: string
  rooms: number
  area: number
  images: [string]
  reviews: [Review]
  averageRating: number
  }

  export interface Comment {
    text: string;
    user: any;
    timestamp?: string;
  }

  export interface Review {
    userId: string
    comment: string
    rating: number
  }
  export interface Listing {
    _id: string
    title: string
    description: string
    price: number
    city: string
    district: string
    rooms: number
    area: number
    images: [string]
    reviews: [Review]
    averageRating: number
  }
  
  export enum ERoles {
      Admin = 'Admin',
      Manager = 'Manager',
      Field = 'Field',
      Staff = 'Staff',
      Employee = 'Employee',
      Supervisor = 'Supervisor',
  }
  
  export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    registrationNumber?: string;
    phoneNumber?: string;
    ERoles?: ERoles[];
    EUserType: ERoles;
    createdAt: Date;
    updatedAt: Date;
    favorites?: any[];
  }
  