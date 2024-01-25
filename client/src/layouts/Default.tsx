import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';
import { GlobalNavbar } from '@/components/GlobalNavbar/GlobalNavbar';
import { CURRENT_USER } from '@/graphql/auth.gql';
import { Container, Flex } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useQuery } from 'urql';

type DefaultLayoutType = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutType) => {
  const [{ data, fetching }] = useQuery({ query: CURRENT_USER });

  const currentUser = data?.users?.[0];
  if (fetching) return null;
  return (
    <Flex mih={'100vh'} bg="gray.0" direction={'column'}>
      <Notifications autoClose={3000} position="top-right" limit={5} />
      <GlobalNavbar user={currentUser} />
      <Container mt={69} py={'lg'} flex={'1'}>
        {children}
      </Container>
      <GlobalFooter />
    </Flex>
  );
};

export default DefaultLayout;
