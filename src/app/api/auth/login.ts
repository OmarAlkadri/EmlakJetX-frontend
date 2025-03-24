import apolloClient from '@/infrastructure/apolloClient';
import { LOGIN } from '@/application/graphql/queries';
import { IUser } from '@/utils/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserResponse {
  access_token: string;
  user: IUser;
}


export const login = async (credentials: LoginCredentials): Promise<UserResponse> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN,
      variables: { data: credentials },
    });

    if (!data || !data.login) {
      throw new Error('Login failed. Invalid credentials.');
    }

    const { accessToken, user } = data.login;

    localStorage.setItem('authToken', accessToken);

    return { access_token: accessToken, user };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred.');
  }
};
