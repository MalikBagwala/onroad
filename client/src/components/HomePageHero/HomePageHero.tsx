import { useCurrentUser } from '@/authentication/AuthContext';
import { Button, Container, Group, Highlight, Stack, Title } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './HomePageHero.module.css';

const keywords = [
  'contribute and access real vehicle quotes anonymously',
  'Anonymity is key at OnRoad',
  'real-time data contributed by the community',
];

const keywords_small = [
  'OnRoad offers live, real-time data',
  'anonymously contributed by the community',
  'complete breakdown of prices',
];
export function HomePageHero() {
  const { data } = useCurrentUser();

  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Stack hiddenFrom="sm">
            <Title>OnRoad: Unleashing Anonymous Wisdom for Smarter Vehicle Choices!</Title>
            <Stack>
              <Highlight size="xl" highlight={keywords_small}>
                Welcome to OnRoad! OnRoad offers live, real-time data, anonymously contributed by
                the community, empowering you with the latest insights for smarter choices. We share
                complete breakdown of prices which seperates us from the pack
              </Highlight>
            </Stack>
          </Stack>
          <Stack visibleFrom="sm">
            <Title>
              Unleashing Anonymous Wisdom for Smarter Vehicle Choices! Your Road to Informed
              Decisions Starts Here.
            </Title>
            <Stack>
              <Highlight size="xl" highlight={keywords}>
                Welcome to OnRoad – your destination for informed vehicle decisions, simplified.
                OnRoad prioritizes your privacy, allowing you to contribute and access real vehicle
                quotes anonymously. Your personal details stay confidential, giving you the freedom
                to share insights without compromise.
              </Highlight>
              <Highlight size="xl" highlight={keywords}>
                Anonymity is key at OnRoad – share your experiences and pricing information
                confidently, knowing your identity is protected. We've implemented robust security
                measures to ensure your data remains safe, so you can focus on making decisions
                worry-free.
              </Highlight>
              <Highlight size="xl" highlight={keywords}>
                What makes OnRoad unique is our live, real-time data contributed by the community.
                Access up-to-the-minute insights from actual users, empowering you with the latest
                information for smarter choices in the automotive world.
              </Highlight>
              <Highlight size="xl" highlight={keywords}>
                OnRoad is more than a platform; it's a secure space for straightforward,
                confidential, and real-time information. Join us on the road to smarter decisions –
                your journey starts here, at OnRoad.
              </Highlight>
            </Stack>
          </Stack>
          <Group mt={30}>
            <Button component={Link} to={'/variants'} radius="xl" size="md">
              View Contributions
            </Button>
            {data?.id ? null : (
              <Button
                radius="xl"
                size="md"
                component={Link}
                to={{ search: '?modal=login' }}
                leftSection={<IconLogin size={14} />}
                variant="default"
              >
                Sign In
              </Button>
            )}
          </Group>
        </div>
        {/* <Image src={image} className={classes.image} /> */}
      </div>
    </Container>
  );
}
