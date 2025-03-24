import { gql } from '@apollo/client';
import apolloClient from '@/infrastructure/apolloClient';

const LOGOUT_USER = gql`
  mutation Logout {
    logout
  }
`;

export const logout = async () => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: LOGOUT_USER,
    });

    if (!data || !data.logout) {
      throw new Error("Failed to logout.");
    }

    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
  }
};
