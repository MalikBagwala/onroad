import { ActionIcon, Anchor, Box, Container, Group, Text, rem } from '@mantine/core';
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrowser,
} from '@tabler/icons-react';
import classes from './GlobalFooter.module.css';
import OnRoadLogo from '../OnroadLogo';
import { Link } from 'react-router-dom';

const links = [
  { link: '#  ', label: 'Contact' },
  { link: '/privacy', label: 'Privacy' },
  { link: '/terms', label: 'Terms' },
];

export function GlobalFooter() {
  const items = links.map((link) => (
    <Anchor component={Link} c="dimmed" key={link.label} to={link.link} lh={1} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <Box bg={'gray.1'} className={classes.footer}>
      <Container className={classes.inner}>
        <OnRoadLogo withImage={false} />
        <Group className={classes.links}>{items}</Group>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon
            component="a"
            href="https://discord.gg/62ffekH8QF"
            size="lg"
            variant="default"
            radius="xl"
          >
            <IconBrandDiscord style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://twitter.com/MalikBagwala"
            size="lg"
            variant="default"
            radius="xl"
          >
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://github.com/MalikBagwala"
            size="lg"
            variant="default"
            radius="xl"
          >
            <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://www.linkedin.com/in/malikbagwala/"
            size="lg"
            variant="default"
            radius="xl"
          >
            <IconBrandLinkedin style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://maalik.dev"
            size="lg"
            variant="default"
            radius="xl"
          >
            <IconBrowser style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  );
}

export default GlobalFooter;
