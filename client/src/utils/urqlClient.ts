import { REFRESH_TOKEN } from '@/graphql/auth.gql';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange, createClient, fetchExchange } from 'urql';

export const getAccessToken = () => localStorage.getItem('token');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setAccessToken = (token: string) => localStorage.setItem('token', token);
export const setRefreshToken = (token: string) => localStorage.setItem('refreshToken', token);

export const removeAccessToken = () => localStorage.removeItem('token');
export const removeRefreshToken = () => localStorage.removeItem('refreshToken');

function makeClient() {
  return createClient({
    url: `https://${import.meta.env.VITE_API_DOMAIN}/hasura/v1/graphql`,
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        return {
          addAuthToOperation(operation) {
            const accessToken = getAccessToken();
            if (operation.query.definitions[0]?.name?.value === 'refreshToken' || !accessToken)
              return operation;
            // if(operation.kind==="mutation"&&ope)

            return utils.appendHeaders(operation, {
              Authorization: `Bearer ${accessToken}`,
            });
          },
          didAuthError(error) {
            return error.graphQLErrors.some((e) => e.extensions?.code === 'invalid-jwt');
          },
          async refreshAuth() {
            const refreshToken = getRefreshToken();
            const { data } = await utils.mutate(REFRESH_TOKEN, { refreshToken });
            const newAccessToken = data?.refreshToken?.data;
            if (newAccessToken) {
              // Update our local variables and write to our storage
              setAccessToken(newAccessToken);
            } else {
              removeAccessToken();
              removeRefreshToken();
              // This is where auth has gone wrong and we need to clean up and redirect to a login page
            }
          },
        };
      }),
      fetchExchange,
    ],
  });
}

export default makeClient;
