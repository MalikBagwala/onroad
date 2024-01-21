import { useAuth } from '@/authentication/AuthContext';
import { LOGIN, LOGIN_WITH_MAGIC_LINK, MEMBERSHIP_TYPE } from '@/graphql/auth.gql';
import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import { Box, Button, CloseButton, Divider, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from 'urql';

export const UserOnboard = () => {
  const { refreshClient } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email address.'),
    },
  });

  const [{ fetching, data }, fetchMembershipType] = useQuery({
    query: MEMBERSHIP_TYPE,
    pause: true,
    variables: { email: form.values.email },
    requestPolicy: 'network-only',
  });
  const [{ fetching: lFetching }, login] = useMutation(LOGIN);
  const [{ fetching: lmFetching }, loginWithMagicLink] = useMutation(LOGIN_WITH_MAGIC_LINK);
  const membershipType = data?.membershipTypeByEmail?.data;

  console.log(membershipType);
  if (membershipType === 'RETURNING_USER') {
    return (
      <Box pos={'relative'} py={'xl'} px={'lg'}>
        <Text size="lg" mb={'md'} ta={'center'} fw={'bold'}>
          Welcome back to OnRoad
        </Text>
        <Button
          onClick={async () => {
            const { data } = await loginWithMagicLink({
              email: form.values.email,
            });
            if (data?.loginWithMagicLink?.message) {
              notifications.show({
                message: data?.loginWithMagicLink?.message,
                color: 'green',
                withBorder: true,
              });
              modals.closeAll();
            }
          }}
          loading={lFetching || lmFetching}
          variant="default"
          type="submit"
          fullWidth
          mt="md"
        >
          Login With Magic Link
        </Button>
        <Text
          style={{
            cursor: 'pointer',
          }}
          onClick={() => {
            form.reset();
            fetchMembershipType({ email: '' });
          }}
          c="purple"
          mt={'0.5rem'}
          ta={'center'}
          size="s"
        >
          Use different email
        </Text>
        <Divider my="xs" label="Or" labelPosition="center" />
        <PasswordInput
          withAsterisk
          label="Password"
          type="password"
          {...form.getInputProps('password')}
        />
        <Button
          loading={lFetching || lmFetching}
          onClick={async () => {
            const { data } = await login({
              email: form.values.email,
              password: form.values.password,
            });
            if (data?.login?.data?.accessToken) {
              setAccessToken(data?.login?.data?.accessToken);
              setRefreshToken(data?.login?.data?.refreshToken);
              refreshClient();
              notifications.show({
                message: data?.login?.message,
                color: 'green',
                withBorder: true,
                autoClose: 1500,
              });
              modals.closeAll();
            }
          }}
          type="submit"
          fullWidth
          mt="md"
        >
          Login With Password
        </Button>
        <CloseButton onClick={modals.closeAll} pos={'absolute'} top={0} right={0} />
      </Box>
    );
  }
  return (
    <Box pos={'relative'} py={'xl'} px={'lg'}>
      <Text size="lg" mb={'md'} ta={'center'} fw={'bold'}>
        Create an Account Or Sign In
      </Text>
      <form onSubmit={form.onSubmit((values) => fetchMembershipType({ email: values.email }))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="Your email"
          {...form.getInputProps('email')}
        />
        <Button loading={fetching} type="submit" fullWidth mt="md">
          Continue With Email
        </Button>
      </form>
      <CloseButton onClick={modals.closeAll} pos={'absolute'} top={0} right={0} />
    </Box>
  );
};
