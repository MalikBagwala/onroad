import { useAuth } from '@/authentication/AuthContext';
import { CurrentUserQuery } from '@/gql/graphql';
import { Avatar, Group, Menu, Text, UnstyledButton, rem, useMantineTheme } from '@mantine/core';
import { IconChevronDown, IconHeart, IconLogout, IconSettings } from '@tabler/icons-react';

type UserMenuType = {
  user?: CurrentUserQuery['users'][0];
};
export const UserMenu = ({ user }: UserMenuType) => {
  const theme = useMantineTheme();
  const { logout } = useAuth();
  const userIdentity = user?.first_name || user?.last_name || user?.email;
  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7}>
            <Avatar radius="xl" size={20} />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {userIdentity}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <IconHeart
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.red[6]}
              stroke={1.5}
            />
          }
        >
          My Contributions
        </Menu.Item>

        <Menu.Item
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
