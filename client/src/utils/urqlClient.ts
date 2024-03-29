import { AUTH_CODE_EXCHANGE } from '@/graphql/auth.gql';
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
import { NavigateFunction } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

export const AUTH_OPERATIONS = [
  'register',
  'login',
  'loginWithMagicLink',
  'authCodeExchange',
  'forgotPassword',
  'forgotPasswordConfirm',
  'membershipTypeByEmail',
  // 'passkeyRegisterOptions',
  // 'passkeyRegisterVerify',
  'passkeyAuthOptions',
  'passkeyAuthOptionsVerify',
];

function makeClient(navigate: NavigateFunction) {
  return createClient({
    url: `https://${import.meta.env.VITE_API_DOMAIN}/hasura/v1/graphql`,
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        return {
          addAuthToOperation(operation) {
            const accessToken = getAccessToken();
            const opDefinition = operation.query.definitions[0] as any;
            operation.context.url = `${operation.context.url}?op=${opDefinition.name.value}`;
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
            try {
              const refreshToken = getRefreshToken();
              if (!refreshToken) throw new Error('No refresh token');
              const { data } = await utils.mutate(AUTH_CODE_EXCHANGE, {
                code: refreshToken,
                type: 'RF',
              });
              const newAccessToken = data?.authCodeExchange?.data?.accessToken;
              if (newAccessToken) {
                // Update our local variables and write to our storage
                setAccessToken(newAccessToken);
              } else {
                removeAccessToken();
                removeRefreshToken();
                // This is where auth has gone wrong and we need to clean up and redirect to a login page
              }
            } catch {
              removeRefreshToken();
              notifications.show({
                id: 'session-expired',
                message: 'Your session has expired, do login to continue using the app',
                color: 'yellow',
                withBorder: true,
                autoClose: 1500,
              });
              navigate('/', { replace: true });
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
