import { useAuth } from '@/authentication/AuthContext';
import { CurrentUserQuery } from '@/gql/graphql';
import {
  Avatar,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChevronDown,
  IconGift,
  IconHeart,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import AddUpdateContribution from '../AddUpdateContribution/AddUpdateContribution';
import { modals } from '@mantine/modals';

type UserMenuType = {
  user?: CurrentUserQuery['users'][0];
};
export const UserMenu = ({ user }: UserMenuType) => {
  const theme = useMantineTheme();
  const { logout } = useAuth();
  let identity = '';
  if (user?.first_name) {
    identity += user.first_name;
  }
  if (user?.last_name) {
    if (user?.first_name) identity += ' ';
    identity += user.last_name;
  }
  if (!identity) return user?.email;
  console.log(user);
  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      withinPortal
    >
      <Menu.Target>
        <Button variant="subtle">
          <Group gap={7}>
            <Avatar
              src={user?.avatar}
              radius="xl"
              size={20}
              imageProps={{
                referrerPolicy: 'no-referrer',
              }}
            />
            <Stack ta={'left'} gap={'2px'}>
              <Text fw={500} c={'gray.8'} size="sm" lh={1} mr={3}>
                {identity}
              </Text>
              <Text c="dimmed" size="sm" lh={1} mr={3}>
                {user?.city?.name}
              </Text>
            </Stack>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          to={'/contributions/new'}
          leftSection={<IconGift style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Add Contribution
        </Menu.Item>
        <Menu.Item
          component={Link}
          to={'/profile/contributions'}
          leftSection={<IconHeart style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          My Contributions
        </Menu.Item>
        <Menu.Item
          component={Link}
          to={'/profile'}
          leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          My Profile
        </Menu.Item>

        <Menu.Item
          onClick={logout}
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
