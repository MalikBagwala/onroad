import { UserMenu } from '@/components/UserMenu/UserMenu';
import { CurrentUserQuery } from '@/gql/graphql';
import { Box, Button, Container, Group } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconLogin } from '@tabler/icons-react';
import OnRoadLogo from '../OnroadLogo';
import { UserOnboard } from '../UserOnboard/UserOnboard';
import styles from './GlobalNavbar.module.css';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
type GlobalNavbarType = {
  user?: CurrentUserQuery['users'][0];
};
export function GlobalNavbar({ user }: GlobalNavbarType) {
  const [params] = useSearchParams();
  const openModal = () =>
    modals.open({
      closeOnEscape: false,
      closeOnClickOutside: false,
      centered: true,
      withCloseButton: false,
      overlayProps: {
        blur: 4,
      },
      children: <UserOnboard />,
    });

  useEffect(() => {
    if (params.get('modal') === 'login') openModal();
  }, [params.get('modal')]);
  return (
    <Box className={styles.base}>
      <Container py={'md'}>
        <Group justify="space-between" h="100%">
          <OnRoadLogo
            textProps={{
              fw: 'bold',
              size: 'xl',
            }}
          />
          <Group visibleFrom="sm">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button leftSection={<IconLogin size={14} />} onClick={openModal} variant="default">
                Sign In
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
