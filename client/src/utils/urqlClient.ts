import { REFRESH_TOKEN } from '@/graphql/auth.gql';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange, createClient, fetchExchange } from 'urql';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeAccessToken,
  removeRefreshToken,
  hasTokenExpired,
} from './tokens';

export const AUTH_OPERATIONS = [
  'register',
  'login',
  'loginWithMagicLink',
  'refreshToken',
  'sendEmailOtp',
  'verifyOtp',
  'forgotPassword',
  'forgotPasswordConfirm',
];
function makeClient() {
  return createClient({
    url: `https://${import.meta.env.VITE_API_DOMAIN}/hasura/v1/graphql`,
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        return {
          addAuthToOperation(operation) {
            const accessToken = getAccessToken();
            const opDefinition = operation.query.definitions[0] as any;
            if (AUTH_OPERATIONS.includes(opDefinition?.name?.value)) return operation;
            if (!accessToken) return operation;
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
          willAuthError(operation) {
            const accessToken = getAccessToken();
            const opDefinition = operation.query.definitions[0] as any;
            if (AUTH_OPERATIONS.includes(opDefinition?.name?.value)) return false;
            if (hasTokenExpired(accessToken)) return true;
            return false;
          },
        };
      }),
      fetchExchange,
    ],
  });
}

export default makeClient;
