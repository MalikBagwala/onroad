import { useAuth } from '@/authentication/AuthContext';
import { PASSKEY_AUTH_OPTIONS, PASSKEY_AUTH_OPTIONS_VERIFY } from '@/graphql/auth.gql';
import { setAccessToken, setRefreshToken } from '@/utils/tokens';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { startAuthentication } from '@simplewebauthn/browser';
import { IconHandRock, IconUserScan } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'urql';

type LoginWithPasskeyType = {};
const LoginWithPasskey = ({}: LoginWithPasskeyType) => {
  const { refreshClient } = useAuth();
  const [, authInit] = useMutation(PASSKEY_AUTH_OPTIONS);
  const [, authVerify] = useMutation(PASSKEY_AUTH_OPTIONS_VERIFY);
  const navigate = useNavigate();
  return (
    <Button
      onClick={async () => {
        const { data: aData } = await authInit({ email: 'm.bagwala@gmail.com' });
        const authCredential = await startAuthentication(aData?.passkeyAuthOptions?.data);

        const { data: avData } = await authVerify({
          credential: JSON.stringify(authCredential),
          credentialId: authCredential.id,
        });
        const tokens = avData?.passkeyAuthOptionsVerify?.data;
        notifications.show({
          message: avData?.passkeyAuthOptionsVerify?.message,
          icon: <IconHandRock />,
          color: avData?.passkeyAuthOptionsVerify?.code === 200 ? 'green' : 'red',
          withBorder: true,
        });
        if (tokens) {
          setAccessToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);
          refreshClient();
          modals.closeAll();
          navigate({ search: '' }, { replace: true });
        }
      }}
      component="a"
      leftSection={<IconUserScan />}
      variant="default"
      type="submit"
      fullWidth
      mt="md"
    >
      Login with passkey
    </Button>
  );
};

export default LoginWithPasskey;
