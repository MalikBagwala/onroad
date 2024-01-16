import { GlobalNavbar } from '@/components/GlobalNavbar/GlobalNavbar';
import { Container, Paper } from '@mantine/core';
import { Welcome } from '../components/Welcome/Welcome';
import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';

export function HomePage() {
  return (
    <>
      <GlobalNavbar />
      <Container pt={69}>
        <Paper py={48}>
          <Welcome />
        </Paper>
      </Container>
      <GlobalFooter />
    </>
  );
}
