import { useAuth } from '@/authentication/AuthContext';
import { FORGOT_PASSWORD_CONFIRM } from '@/graphql/auth.gql';
import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import { Stack, PasswordInput, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation } from 'urql';
import styles from './ResetPassword.module.css';
type ResetPasswordType = {};
const ResetPassword = ({}: ResetPasswordType) => {
  const [params] = useSearchParams();
  const { refreshClient } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = params.get('u');
  const [{ fetching }, forgotPasswordConfirm] = useMutation(FORGOT_PASSWORD_CONFIRM);
  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) => {
        if (value.length >= 8 && !/\s/.test(value)) {
          return null; // Valid password
        } else {
          return 'Password must be at least 8 characters long without any spaces.';
        }
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  return (
    <div className={styles.base}>
      <form
        style={{
          marginTop: '2rem',
          maxWidth: '30rem',
        }}
        onSubmit={form.onSubmit(async (values) => {
          if (!userId || !id) {
            return notifications.show({
              message: 'Invalid request, Please make sure you clicked the right link',
              color: 'red',
              withBorder: true,
              icon: <IconX size={16} />,
            });
          }
          const { data } = await forgotPasswordConfirm({
            input: {
              userId: userId,
              token: id,
              password: values.password,
              confirmPassword: values.confirmPassword,
            },
          });
          const response = data?.forgotPasswordConfirm;
          notifications.show({
            message: response?.message,
            color: response?.code === 200 ? 'green' : 'red',
            withBorder: true,
          });
          if (response?.data) {
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            refreshClient();
            navigate('/', { replace: true });
          }
        })}
      >
        <Stack>
          <Text c="gray.7" fw={600} size="xl">
            Reset Your Password
          </Text>
          <PasswordInput
            withAsterisk
            {...form.getInputProps('password')}
            placeholder="Your password"
            description="Password must be at least 8 characters long"
            label="Password"
            required
            visible={visible}
            onVisibilityChange={toggle}
          />
          <PasswordInput
            withAsterisk
            {...form.getInputProps('confirmPassword')}
            placeholder="Your password"
            label="Confirm Password"
            required
            visible={visible}
            onVisibilityChange={toggle}
          />
          <Button variant="light" loading={fetching} type="submit" fullWidth mt="md">
            Reset Password
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default ResetPassword;
