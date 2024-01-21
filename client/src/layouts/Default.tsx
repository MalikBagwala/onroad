import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';
import { GlobalNavbar } from '@/components/GlobalNavbar/GlobalNavbar';
import { CURRENT_USER } from '@/graphql/auth.gql';
import { Container, Flex } from '@mantine/core';
import { useQuery } from 'urql';

type DefaultLayoutType = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutType) => {
  const [{ data, fetching }] = useQuery({ query: CURRENT_USER });

  const currentUser = data?.users?.[0];
  if (fetching) return null;
  return (
    <Flex mih={'100vh'} direction={'column'}>
      <GlobalNavbar user={currentUser} />
      <Container mt={69} py={'lg'} flex={'1'}>
        {children}
      </Container>
      <GlobalFooter />
    </Flex>
  );
};

export default DefaultLayout;
