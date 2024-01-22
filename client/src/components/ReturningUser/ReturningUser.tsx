import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import { Button, Divider, PasswordInput, CloseButton, Box, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import { useAuth } from '@/authentication/AuthContext';
import { LOGIN, LOGIN_WITH_MAGIC_LINK } from '@/graphql/auth.gql';
import { useMutation } from 'urql';
import { useForm } from '@mantine/form';

type ReturningUserType = {
  email: string;
  abort: () => void;
};
const ReturningUser = ({ email, abort }: ReturningUserType) => {
  const { refreshClient } = useAuth();
  const [{ fetching: lFetching }, login] = useMutation(LOGIN);
  const [{ fetching: lmFetching }, loginWithMagicLink] = useMutation(LOGIN_WITH_MAGIC_LINK);
  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) => (value.length > 0 ? null : 'Please enter a password.'),
    },
  });
  return (
    <UserOnboardWrapper title={'Welcome back to OnRoad'}>
      <Button
        onClick={async () => {
          const { data } = await loginWithMagicLink({
            email,
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
          abort();
        }}
        c="purple"
        mt={'0.5rem'}
        ta={'center'}
        size="s"
      >
        Login with a different email
      </Text>
      <Divider my="xs" label="Or" labelPosition="center" />
      <PasswordInput
        withAsterisk
        label="Password"
        type="password"
        autoFocus
        {...form.getInputProps('password')}
      />
      <Button
        loading={lFetching || lmFetching}
        onClick={async () => {
          const { data } = await login({
            email,
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
    </UserOnboardWrapper>
  );
};

export default ReturningUser;
