import CitySelector from '@/components/NewUser/CitySelector';
import { Button, Flex, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import styles from './ProfileDetails.module.css';
import { useForm } from '@mantine/form';
import { useCurrentUser } from '@/authentication/AuthContext';
import { useMutation } from 'urql';
import { UPDATE_USER } from '@/graphql/user.gql';
import { notifications } from '@mantine/notifications';
type ProfileDetailsType = {};
const ProfileDetails = ({}: ProfileDetailsType) => {
  const { data: uData } = useCurrentUser();
  const form = useForm({
    initialValues: {
      firstName: uData?.first_name,
      lastName: uData?.last_name,
      username: uData?.username,
      city: uData?.city?.id,
    },
  });
  const [{ fetching }, updateUser] = useMutation(UPDATE_USER);
  return (
    <Stack>
      <Text fw={500} c={'gray.7'} size="xl">
        Basic Details
      </Text>
      <form
        className={styles.form}
        onReset={form.reset}
        onSubmit={form.onSubmit(async (values) => {
          const { data } = await updateUser({
            pk_columns: {
              id: uData?.id,
            },
            _set: {
              first_name: values.firstName,
              last_name: values.lastName,
              username: values.username,
              city_id: values.city,
            },
          });
          if (data?.update_users_by_pk?.id) {
            notifications.show({
              title: 'Profile updated successfully',
              message: 'Your profile has been updated successfully',
              color: 'green',
            });
          } else {
            notifications.show({
              title: 'Profile update failed',
              message: 'Your profile update failed',
              color: 'red',
            });
          }
        })}
      >
        <SimpleGrid cols={2}>
          <TextInput
            description="eg. Steve"
            label="First Name"
            placeholder="First Name"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            description="eg. Rogers"
            label="Last Name"
            placeholder="Last Name"
            {...form.getInputProps('lastName')}
          />
          <TextInput
            description="eg. anonbuddy"
            label="Username"
            placeholder="Username"
            {...form.getInputProps('username')}
          />
          <CitySelector {...form.getInputProps('city')} />
        </SimpleGrid>
        <Flex mt={'md'} gap={'md'}>
          <Button loading={fetching} type="submit">
            Save
          </Button>
          <Button loading={fetching} type="reset" variant="light">
            Reset
          </Button>
        </Flex>
      </form>
    </Stack>
  );
};

export default ProfileDetails;
