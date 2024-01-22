import { MEMBERSHIP_TYPE } from '@/graphql/auth.gql';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useClient } from 'urql';
import NewUser from '../NewUser/NewUser';
import ReturningUser from '../ReturningUser/ReturningUser';
import UserOnboardWrapper from './UserOnboardWrapper';

export const UserOnboard = () => {
  const client = useClient();
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email address.'),
    },
  });
  const [membershipType, setMembershipType] = useState<null | 'NEW_USER' | 'RETURNING_USER'>(null);
  const [loading, setLoading] = useState(false);

  function handleAbort() {
    form.reset();
    setMembershipType(null);
  }

  if (membershipType === 'RETURNING_USER') {
    return <ReturningUser email={form.values.email} abort={handleAbort} />;
  }

  if (membershipType === 'NEW_USER') {
    return <NewUser email={form.values.email} abort={handleAbort} />;
  }
  return (
    <UserOnboardWrapper title="Create an Account Or Sign In">
      <form
        onSubmit={form.onSubmit(async (values) => {
          setLoading(true);
          const { data } = await client.query(MEMBERSHIP_TYPE, { email: values.email }).toPromise();
          setMembershipType(data?.membershipTypeByEmail?.data as any);
          setLoading(false);
        })}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="Your email"
          {...form.getInputProps('email')}
        />
        <Button loading={loading} type="submit" fullWidth mt="md">
          Continue With Email
        </Button>
      </form>
    </UserOnboardWrapper>
  );
};
