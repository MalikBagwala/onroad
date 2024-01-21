import { authExchange } from '@urql/exchange-auth';
import { cacheExchange, createClient, fetchExchange } from 'urql';

export const getAccessToken = () => localStorage.getItem('token');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
function makeClient() {
  return createClient({
    url: `https://${import.meta.env.VITE_API_DOMAIN}/hasura/v1/graphql`,
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        const accessToken = getAccessToken();
        return {
          addAuthToOperation(operation) {
            if (!accessToken) return operation;
            return utils.appendHeaders(operation, {
              Authorization: `Bearer ${accessToken}`,
            });
          },
        };
      }),
      fetchExchange,
    ],
  });
}

export default makeClient;
