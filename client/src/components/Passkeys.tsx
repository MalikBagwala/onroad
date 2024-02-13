import { REGISTER_PASSKEY, VERIFY_PASSKEY_REGISTERATION } from '@/graphql/auth.gql';
import { Button, Stack } from '@mantine/core';
import React from 'react';
import { useClient, useMutation } from 'urql';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

const decoder = new TextDecoder();
type PasskeysType = {};
const Passkeys = ({}: PasskeysType) => {
  const [{ fetching }, register] = useMutation(REGISTER_PASSKEY);
  const [{ fetching: vFetching }, verify] = useMutation(VERIFY_PASSKEY_REGISTERATION);

  return (
    <Stack>
      <Button
        onClick={async () => {
          const { data } = await register({ email: 'm.bagwala@gmail.com' });
          const registrationOptions = data?.registerPasskey?.data;
          const credential = await startRegistration(registrationOptions);
          const { data: vData } = await verify({
            credential: JSON.stringify(credential),
          });
          console.log(vData);
        }}
      >
        Register
      </Button>
      <Button
        onClick={async () => {
          // const response = await startAuthentication();
          // const registrationOptions = data?.registerPasskey?.data;
          // const credential = await startRegistration(registrationOptions);
          // const { data: vData } = await verify({
          //   credential: JSON.stringify(credential),
          // });
          // console.log(vData);
        }}
      >
        Login
      </Button>
    </Stack>
  );
};

export default Passkeys;
