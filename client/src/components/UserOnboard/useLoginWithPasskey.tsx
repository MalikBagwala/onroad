import { PasskeyAuthOptionsVerifyMutation } from '@/gql/graphql';
import { PASSKEY_AUTH_OPTIONS, PASSKEY_AUTH_OPTIONS_VERIFY } from '@/graphql/auth.gql';
import { startAuthentication } from '@simplewebauthn/browser';
import { useMutation } from 'urql';

type LoginWithPassKeyOptions = {
  onCompleted?: (
    data: PasskeyAuthOptionsVerifyMutation['passkeyAuthOptionsVerify'] | undefined
  ) => void;
  onError?: (error: Error) => void;
};
export default function useLoginWithPasskey(options: LoginWithPassKeyOptions) {
  const [, authInit] = useMutation(PASSKEY_AUTH_OPTIONS);
  const [, authVerify] = useMutation(PASSKEY_AUTH_OPTIONS_VERIFY);

  async function authenticate(email?: string) {
    try {
      const { data: aData } = await authInit({ email });
      const authCredential = await startAuthentication(aData?.passkeyAuthOptions?.data);
      const { data: avData } = await authVerify({
        credential: JSON.stringify(authCredential),
        credentialId: authCredential.id,
      });
      options?.onCompleted?.(avData?.passkeyAuthOptionsVerify);
    } catch (error: any) {
      options?.onError?.(error);
    }
  }

  return { authenticate } as const;
}
