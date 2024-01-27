import { useAuth } from '@/authentication/AuthContext';
import { REGISTER, SEND_EMAIL_OTP } from '@/graphql/auth.gql';
import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import { Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from 'urql';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import CitySelector from './CitySelector';
import VerifyOtp from './VerifyOtp';
type NewUserType = {
  email: string;
  abort: () => void;
};
const NewUser = ({ email, abort }: NewUserType) => {
  const { refreshClient } = useAuth();

  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      city: null,
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
  const [{ fetching }, register] = useMutation(REGISTER);
  const [{ data }, sendEmailOtp] = useMutation(SEND_EMAIL_OTP);

  if (data?.sendEmailOtp?.code === 200) {
    return <VerifyOtp email={email} />;
  }
  return (
    <UserOnboardWrapper title={'Welcome to OnRoad'}>
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
        Register with a different email
      </Text>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { data } = await register({
            input: {
              email,
              password: values.password,
              confirmPassword: values.confirmPassword,
              firstName: values.firstName,
              lastName: values.lastName,
              cityId: values.city,
            },
          });
          const response = data?.register?.data;
          if (response) {
            setAccessToken(response.tokens.accessToken);
            setRefreshToken(response.tokens.refreshToken);
            refreshClient();
            sendEmailOtp({ email });
            // modals.closeAll();
          }
        })}
      >
        <Stack>
          <TextInput
            autoFocus
            description="This is optional and will not be displayed publicly."
            label="First Name"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            description="This is optional and will not be displayed publicly."
            placeholder="Your last name"
            label="Last Name"
            {...form.getInputProps('lastName')}
          />
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
          <CitySelector {...form.getInputProps('city')} />
          <Button color="purple" loading={fetching} type="submit" fullWidth mt="md">
            Create Account
          </Button>
        </Stack>
      </form>
    </UserOnboardWrapper>
  );
};

export default NewUser;
