import { useCurrentUser } from '@/authentication/AuthContext';
import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';
import { GlobalNavbar } from '@/components/GlobalNavbar/GlobalNavbar';
import { Box, Container, Flex } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

type DefaultLayoutType = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutType) => {
  const { fetching, data: currentUser } = useCurrentUser();

  if (fetching) return null;
  return (
    <Flex mih={'100vh'} bg="gray.0" direction={'column'}>
      <Notifications autoClose={3000} position="top-right" limit={5} />
      <GlobalNavbar user={currentUser} />
      <Box flex={'1'}>
        <Container mt={69} py={'lg'}>
          {children}
        </Container>
      </Box>
      <GlobalFooter />
    </Flex>
  );
};

export default DefaultLayout;
