import { useAuth } from '@/authentication/AuthContext';
import { PASSKEY_AUTH_OPTIONS, PASSKEY_AUTH_OPTIONS_VERIFY } from '@/graphql/auth.gql';
import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { startAuthentication } from '@simplewebauthn/browser';
import { IconUserScan } from '@tabler/icons-react';
import { useMutation } from 'urql';

type LoginWithPasskeyType = {};
const LoginWithPasskey = ({}: LoginWithPasskeyType) => {
  const { refreshClient } = useAuth();
  const [, authInit] = useMutation(PASSKEY_AUTH_OPTIONS);
  const [, authVerify] = useMutation(PASSKEY_AUTH_OPTIONS_VERIFY);
  return (
    <Button
      onClick={async () => {
        const { data: aData } = await authInit({});
        const authCredential = await startAuthentication(aData?.passkeyAuthOptions?.data);

        const { data: avData } = await authVerify({
          credential: JSON.stringify(authCredential),
          credentialId: authCredential.id,
        });
        const tokens = avData?.passkeyAuthOptionsVerify?.data;
        if (tokens) {
          setAccessToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);
          refreshClient();
          modals.closeAll();
        }
      }}
      component="a"
      leftSection={<IconUserScan />}
      variant="default"
      type="submit"
      fullWidth
      mt="md"
    >
      Continue with passkey
    </Button>
  );
};

export default LoginWithPasskey;
