import { useAuth } from '@/authentication/AuthContext';
import { CURRENT_USER } from '@/graphql/auth.gql';
import { useQuery } from 'urql';

type DefaultLayoutType = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutType) => {
  const { logout } = useAuth();
  const [{ data, fetching }] = useQuery({ query: CURRENT_USER });

  if (fetching) return null;
  return (
    <div>
      This is default layout
      <p>{data?.users?.[0]?.email || 'na'} Auth User</p>
      {children}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DefaultLayout;
