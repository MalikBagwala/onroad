import { useAuth } from '@/authentication/AuthContext';
import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';
import { GlobalNavbar } from '@/components/GlobalNavbar/GlobalNavbar';
import { CURRENT_USER } from '@/graphql/auth.gql';
import { Box, Container, Flex, Stack } from '@mantine/core';
import { useQuery } from 'urql';

type DefaultLayoutType = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutType) => {
  const { logout } = useAuth();
  const [{ data, fetching }] = useQuery({ query: CURRENT_USER });

  if (fetching) return null;
  return (
    <Flex mih={'100vh'} direction={'column'}>
      <GlobalNavbar />
      <Container flex={'1'}>Main Section</Container>
      <GlobalFooter />
    </Flex>
  );
};

export default DefaultLayout;
