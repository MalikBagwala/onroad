import { Button, PinInput, Stack } from '@mantine/core';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import { useMutation } from 'urql';
import { VERIFY_EMAIL_OTP } from '@/graphql/auth.gql';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

type VerifyOtpType = {
  email: string;
};
const VerifyOtp = ({ email }: VerifyOtpType) => {
  const form = useForm({
    initialValues: {
      otp: '',
    },
    validate: {
      otp: (value) => (value.length === 6 ? null : 'Please enter a valid OTP.'),
    },
  });
  const [{ fetching }, verify] = useMutation(VERIFY_EMAIL_OTP);
  return (
    <UserOnboardWrapper title={`Please verify your email - ${email}`}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { data } = await verify({
            input: { otp: values.otp, type: 'EM' },
          });
          if (data?.verifyOtp?.code === 200) {
            notifications.show({
              message: 'Email verified successfully!, Welcome to OnRoad :)',
              color: 'green',
              withBorder: true,
            });
            modals.closeAll();
          } else {
            notifications.show({
              message: 'Invalid OTP',
              color: 'red',
              withBorder: true,
            });
          }
        })}
      >
        <Stack mt={'sm'}>
          <PinInput {...form.getInputProps('otp')} style={{ alignSelf: 'center' }} length={6} />
          <Button loading={fetching} type="submit" fullWidth mt="md">
            Verify
          </Button>
        </Stack>
      </form>
    </UserOnboardWrapper>
  );
};

export default VerifyOtp;
