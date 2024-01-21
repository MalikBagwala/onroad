import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import makeClient from '@/utils/urqlClient';
import client from '@/utils/urqlClient';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Client, Provider } from 'urql';

type AuthProviderType = {
  children: React.ReactNode;
};

type AuthContextProps = {
  logout: () => void;
};
const AuthContext = createContext<AuthContextProps>(null as any);

const AuthProvider = ({ children }: AuthProviderType) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client>(makeClient());
  const refreshClient = () => setClient(makeClient());
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    refreshClient();
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
    <AuthContext.Provider value={{ logout }}>
      <Provider value={client}>{children}</Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
