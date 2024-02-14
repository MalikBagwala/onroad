import { AUTH_CODE_EXCHANGE, CURRENT_USER, DELETE_USER_TOKENS } from '@/graphql/auth.gql';
import { getAccessToken, setAccessToken, setRefreshToken } from '@/utils/tokens';
import makeClient from '@/utils/urqlClient';
import { notifications } from '@mantine/notifications';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Client, Provider, useQuery } from 'urql';

type AuthProviderType = {
  children: React.ReactNode;
};

type AuthContextProps = {
  logout: () => void;
  refreshClient: () => void;
};
const AuthContext = createContext<AuthContextProps>(null as any);

const AuthProvider = ({ children }: AuthProviderType) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client>(makeClient(navigate));
  const refreshClient = useCallback(() => setClient(makeClient(navigate)), [navigate, setClient]);
  const logout = async () => {
    try {
      await client.mutation(DELETE_USER_TOKENS, {
        where: {
          client: {
            _eq: 'web',
          },
        },
      });
    } catch {
      console.warn('Error deleting refresh tokens');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    refreshClient();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    async function initAuth() {
      const access = params.get('access');
      const code = params.get('code');
      const code_type = params.get('type');
      if (code && code_type) {
        const { data } = await client.mutation(AUTH_CODE_EXCHANGE, { code, type: code_type });
        if (data?.authCodeExchange?.data) {
          const { accessToken, refreshToken } = data.authCodeExchange.data;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
        } else {
          notifications.show({
            message:
              'Oops. The link seems to be invalid or it has expired. Login again to get a new one.',
            color: 'red',
            withBorder: true,
          });
        }
        refreshClient();
        navigate('/', { replace: true });
      } else if (access) {
        setAccessToken(access);
        refreshClient();
        navigate('/', { replace: true });
      }
    }
    initAuth();
  }, [params, refreshClient]);

  return (
    <AuthContext.Provider value={{ logout, refreshClient }}>
      <Provider value={client}>{children}</Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useCurrentUser = () => {
  const accessToken = getAccessToken();
  const navigate = useNavigate();
  const [{ fetching, data, error }, fetchUser] = useQuery({
    query: CURRENT_USER,
    pause: !accessToken || window.location.pathname.startsWith('/reset'),
  });
  const user = !accessToken ? null : data?.users?.[0];
  const hasContributed = user?.has_contributed;

  useEffect(() => {
    if (!hasContributed && user?.id && user?.email_verified) {
      navigate('/contributions/new', { replace: true });
    }
  }, [hasContributed, user]);
  return { fetching, data: user, error, fetchUser } as const;
};
export default AuthProvider;
