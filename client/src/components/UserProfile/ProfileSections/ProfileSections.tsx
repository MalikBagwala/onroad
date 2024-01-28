import { useAuth, useCurrentUser } from '@/authentication/AuthContext';
import { Image, Stack, Text } from '@mantine/core';
import {
  IconFingerprint,
  IconHeart,
  IconLogout,
  IconUser,
  IconUserCircle,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import classes from './ProfileSections.module.css';

const data = [
  { link: '/profile', label: 'Profile', icon: IconUser },
  { link: '/profile/account', label: 'Account', icon: IconFingerprint },
  { link: '/profile/contributions', label: 'Contributions', icon: IconHeart },
];

export function ProfileSections() {
  const location = useLocation();
  const { logout } = useAuth();
  const { data: uData } = useCurrentUser();
  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={location.pathname === item.link ? true : undefined}
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack dir="column" className={classes.header} justify="center" align="center" gap={0}>
          {uData?.avatar ? (
            <Image
              radius={'100%'}
              h={64}
              w={64}
              className={classes.avatar}
              src={uData?.avatar || undefined}
              referrerPolicy="no-referrer"
            />
          ) : (
            <IconUserCircle size={64} color="gray" strokeWidth={1} />
          )}
          <Text size="lg">
            {uData?.first_name} {uData?.last_name}
          </Text>
        </Stack>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            logout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
