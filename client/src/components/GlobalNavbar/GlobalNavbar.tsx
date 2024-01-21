import { Box, Button, Container, Group, Text } from '@mantine/core';
import styles from './GlobalNavbar.module.css';
import { CurrentUserQuery } from '@/gql/graphql';
import { UserMenu } from '@/components/UserMenu/UserMenu';
type GlobalNavbarType = {
  user?: CurrentUserQuery['users'][0];
};
export function GlobalNavbar({ user }: GlobalNavbarType) {
  return (
    <Box className={styles.base}>
      <Container py={'md'}>
        <Group justify="space-between" h="100%">
          <Text fw={'bold'} size="xl">
            OnRoad
          </Text>
          <Group visibleFrom="sm">
            {user ? <UserMenu user={user} /> : <Button variant="default">Sign In</Button>}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
