import { UserMenu } from '@/components/UserMenu/UserMenu';
import { CurrentUserQuery } from '@/gql/graphql';
import { Box, Button, Container, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import styles from './GlobalNavbar.module.css';
import { UserOnboard } from '../UserOnboard/UserOnboard';
type GlobalNavbarType = {
  user?: CurrentUserQuery['users'][0];
};
export function GlobalNavbar({ user }: GlobalNavbarType) {
  const openModal = () =>
    modals.open({
      centered: true,
      withCloseButton: false,
      overlayProps: {
        blur: 3,
      },
      children: <UserOnboard />,
    });
  return (
    <Box className={styles.base}>
      <Container py={'md'}>
        <Group justify="space-between" h="100%">
          <Text fw={'bold'} size="xl">
            OnRoad
          </Text>
          <Group visibleFrom="sm">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button onClick={openModal} variant="default">
                Sign In
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
