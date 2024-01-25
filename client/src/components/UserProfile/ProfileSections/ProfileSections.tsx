import OnRoadLogo from '@/components/OnroadLogo';
import { Code, Group } from '@mantine/core';
import { IconFingerprint, IconHeart, IconLogout, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './ProfileSections.module.css';
import { useAuth } from '@/authentication/AuthContext';

const data = [
  { link: '', label: 'Profile', icon: IconUser },
  { link: '', label: 'Account', icon: IconFingerprint },
  { link: '', label: 'Contributions', icon: IconHeart },
];

export function ProfileSections() {
  const [active, setActive] = useState(data[0].label);
  const { logout } = useAuth();
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <OnRoadLogo />
          <Code fw={700}>v3.1.2</Code>
        </Group>
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
