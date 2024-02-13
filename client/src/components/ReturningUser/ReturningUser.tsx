import { useAuth } from '@/authentication/AuthContext';
import { FORGOT_PASSWORD, LOGIN, LOGIN_WITH_MAGIC_LINK } from '@/graphql/auth.gql';
import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import { Button, CloseButton, Divider, PasswordInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMutation } from 'urql';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import { useNavigate } from 'react-router-dom';
import { IconHandRock } from '@tabler/icons-react';

type ReturningUserType = {
  email: string;
  abort: () => void;
};
const ReturningUser = ({ email, abort }: ReturningUserType) => {
  const navigate = useNavigate();
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
  const [_, forgot] = useMutation(FORGOT_PASSWORD);
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
            navigate({ search: '' }, { replace: true });
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
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { data } = await login({
            email,
            password: values.password,
          });
          if (data?.login?.data?.accessToken) {
            setAccessToken(data?.login?.data?.accessToken);
            setRefreshToken(data?.login?.data?.refreshToken);
            refreshClient();
            modals.closeAll();
            navigate({ search: '' }, { replace: true });
          }
          notifications.show({
            message: data?.login?.message,
            color: data?.login?.code === 200 ? 'green' : 'red',
            withBorder: true,
            autoClose: 1500,
            icon: <IconHandRock />,
          });
        })}
      >
        <PasswordInput
          withAsterisk
          label="Password"
          type="password"
          autoFocus
          {...form.getInputProps('password')}
        />
        <Button loading={lFetching || lmFetching} type="submit" fullWidth mt="md">
          Login With Password
        </Button>
        <Text
          style={{
            cursor: 'pointer',
          }}
          c={'gray.7'}
          fw={600}
          mt={'xs'}
          onClick={async () => {
            const { data } = await forgot({
              identity: email,
            });
            if (data?.forgotPassword?.success) {
              notifications.show({
                message: data?.forgotPassword?.message,
                color: 'green',
                withBorder: true,
                autoClose: 9000,
              });
              modals.closeAll();
            }
          }}
        >
          forgot password?{' '}
        </Text>
      </form>
      <CloseButton onClick={modals.closeAll} pos={'absolute'} top={0} right={0} />
    </UserOnboardWrapper>
  );
};

export default ReturningUser;
