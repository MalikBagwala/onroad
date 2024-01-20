import { REFRESH_TOKEN } from '@/graphql/auth.gql';
import { useLocalStorage } from '@mantine/hooks';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Provider, createClient, fetchExchange, makeOperation } from 'urql';

type AuthProviderType = {
  children: React.ReactNode;
};

type AuthContextProps = {
  logout: () => void;
};
const AuthContext = createContext<AuthContextProps>(null as any);

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const AuthProvider = ({ children }: AuthProviderType) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [tokens, setTokens] = useLocalStorage<Partial<Tokens>>({ key: 'tokens', defaultValue: {} });

  const logout = () => setTokens({});

  useEffect(() => {
    const access = params.get('access');
    const refresh = params.get('refresh');
    if (access && refresh) {
      setTokens({ accessToken: access, refreshToken: refresh });
      //   Remove Tokens from URL
      navigate('/', { replace: true });
    }
  }, [params]);
  const client = useMemo(() => {
    return createClient({
      url: `https://${import.meta.env.VITE_API_DOMAIN}/hasura/v1/graphql`,

      fetchOptions: () => {
        return {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        };
      },
      exchanges: [cacheExchange({}), fetchExchange],
    });
  }, [tokens]);
  return (
    <AuthContext.Provider value={{ logout }}>
      <Provider value={client}>{children}</Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
