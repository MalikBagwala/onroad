import { Box, Button, Container, Group, Text } from '@mantine/core';
import styles from './GlobalNavbar.module.css';
export function GlobalNavbar() {
  return (
    <Box className={styles.base}>
      <Container py={'md'}>
        <Group justify="space-between" h="100%">
          <Text fw={'bold'} size="xl">
            OnRoad
          </Text>

          <Group visibleFrom="sm">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
