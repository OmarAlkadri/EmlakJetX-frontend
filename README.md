# Real Estate Listings Frontend

## Project Overview

This is the frontend application for the **Real Estate Listings** project, built with **Next.js**. It interacts with a **NestJS** backend using **GraphQL** and **MongoDB**.

## Features

- **User Authentication** (Register/Login)
- **Property Listings** (Create, View, Update, Delete)
- **Search & Filtering** (Location, Price, Number of Rooms, etc.)
- **Favorites System** (Save and manage favorite listings)
- **Responsive UI** using Tailwind CSS

## Technologies Used

- **Next.js** (React Framework for SSR & SSG)
- **GraphQL** (Apollo Client for API communication)
- **Tailwind CSS** (For styling)
- **Redux Toolkit** (For state management)
- **JWT Authentication** (Token-based authentication)
- **react-hook-form** (For form validation)

## Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 16.x)
- pnpm
- A running backend server

### Clone the Repository

```sh
git clone https://github.com/yourusername/real-estate-frontend.git
cd real-estate-frontend
```

### Install Dependencies

```sh
pnpm install  # or npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
```

### Running the Development Server

```sh
pnpm dev  # or npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```bash
src/
├── app
│   ├── ToastProvider.tsx
│   ├── api/ (Authentication & User Management)
│   ├── auth/ (Login & Registration Pages)
│   ├── dashboard/ (Admin & User Dashboard)
│   ├── globals.css, layout.tsx, provider.tsx (Global Styling & Providers)
│   ├── metadata.ts (SEO Metadata)
├── application
│   ├── graphql/queries.ts (GraphQL API Queries)
├── assets
│   ├── onologo.png (Static Assets)
├── contexts
│   ├── AuthContext.tsx (Authentication Context)
├── infrastructure
│   ├── apolloClient.ts (GraphQL Client Setup)
├── presentation
│   ├── components/ (Reusable UI Components)
│   ├── layouts/ (Page Layouts for Admin, Employee, etc.)
├── styles
│   ├── globals.css, tailwind.css (Global Styles)
└── utils
    ├── index.ts, types.ts (Helper Functions & Type Definitions)
```

## API Integration

The frontend interacts with the NestJS backend using Apollo Client. Queries and mutations are defined in the `graphql/` folder.

### Example Query (Fetching Listings)

```graphql
query GetListings {
  listings {
    id
    title
    price
    location
  }
}
```

## Deployment

For production deployment, use:

```sh
pnpm build  # or npm run build
pnpm start  # or npm run start
```

You can deploy this app on **Vercel**, **Netlify**, or any hosting provider supporting Next.js.

## License

This project is licensed under the MIT License.
