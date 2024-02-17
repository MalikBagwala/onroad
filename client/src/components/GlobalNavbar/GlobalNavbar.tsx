import { UserMenu } from '@/components/UserMenu/UserMenu';
import { CurrentUserQuery } from '@/gql/graphql';
import { Box, Button, Container, Group } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconLogin } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import OnRoadLogo from '../OnroadLogo';
import { UserOnboard } from '../UserOnboard/UserOnboard';
import VariantSearch from '../VariantSearch/VariantSearch';
import styles from './GlobalNavbar.module.css';
type GlobalNavbarType = {
  user?: CurrentUserQuery['users'][0] | null;
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
          <Group>
            {user ? (
              <Group>
                <VariantSearch />
                <UserMenu user={user} />
              </Group>
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
