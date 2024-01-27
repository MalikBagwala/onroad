import AddUpdateContribution from '@/components/AddUpdateContribution/AddUpdateContribution';
import { CURRENT_USER, DELETE_REFRESH_TOKENS } from '@/graphql/auth.gql';
import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import makeClient from '@/utils/urqlClient';
import { modals } from '@mantine/modals';
import { createContext, useContext, useEffect, useState } from 'react';
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
  const [client, setClient] = useState<Client>(makeClient());
  const refreshClient = () => setClient(makeClient());
  const logout = async () => {
    try {
      await client.mutation(DELETE_REFRESH_TOKENS, {
        where: {
          client: {
            _eq: 'web',
          },
        },
      });
    } catch {
      console.log('Error deleting refresh tokens');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    refreshClient();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const access = params.get('access');
    const refresh = params.get('refresh');
    if (access) {
      setAccessToken(access);
      if (refresh) setRefreshToken(refresh);
      refreshClient();
      //   Remove Tokens from URL
      navigate('/', { replace: true });
    }
  }, [params, refreshClient]);

  return (
    <AuthContext.Provider value={{ logout, refreshClient }}>
      <Provider value={client}>{children}</Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useCurrentUser = () => {
  const [{ fetching, data, error }] = useQuery({ query: CURRENT_USER });
  const user = data?.users?.[0];
  const hasContributed = user?.has_contributed;

  useEffect(() => {
    console.log(hasContributed);
    if (!hasContributed && user?.id) {
      modals.open({
        size: 'lg',
        centered: true,
        withCloseButton: false,
        overlayProps: {
          blur: 4,
        },
        children: <AddUpdateContribution />,
      });
    }
  }, [hasContributed, user]);
  return { fetching, data: user, error } as const;
};
export default AuthProvider;
