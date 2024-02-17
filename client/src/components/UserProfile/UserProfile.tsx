import { Box, Flex } from '@mantine/core';
import { ProfileSections } from './ProfileSections/ProfileSections';
import { Outlet } from 'react-router-dom';
import styles from './UserProfile.module.css';

type UserProfileType = {};
const UserProfile = ({}: UserProfileType) => {
  return (
    <Flex maw={{ xs: '100%', lg: '60rem' }} m={'auto'} className={styles.base}>
      <ProfileSections />
      <Box w={'65%'} p={'lg'} bg={'white'}>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default UserProfile;
