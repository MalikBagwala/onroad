import CitySelector from '@/components/NewUser/CitySelector';
import { Stack, Text, TextInput } from '@mantine/core';

type ProfileDetailsType = {};
const ProfileDetails = ({}: ProfileDetailsType) => {
  return (
    <Stack>
      <Text fw={500} c={'gray.7'} size="xl">
        Basic Details
      </Text>
      <form>
        <TextInput label="First Name" placeholder="First Name" />
        <TextInput label="Last Name" placeholder="Last Name" />
        <TextInput label="Username" placeholder="Username" />
        <CitySelector />
      </form>
    </Stack>
  );
};

export default ProfileDetails;
