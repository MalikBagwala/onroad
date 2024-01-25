import { Box, Flex } from '@mantine/core';
import { ProfileSections } from './ProfileSections/ProfileSections';

type UserProfileType = {};
const UserProfile = ({}: UserProfileType) => {
  return (
    <Flex>
      <ProfileSections />
      <Box bg={'white'}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis aut quod ut qui ad. Animi
        maiores nesciunt ut. Officiis provident deleniti debitis. Ea consectetur facere,
        exercitationem distinctio porro eius hic eum incidunt totam dicta culpa ab, nam unde
        corrupti. Eaque eligendi odit possimus deleniti quidem vitae corporis eius id
        necessitatibus!
      </Box>
    </Flex>
  );
};

export default UserProfile;
