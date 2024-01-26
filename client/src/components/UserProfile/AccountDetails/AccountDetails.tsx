import { useCurrentUser } from '@/authentication/AuthContext';
import { DELETE_REFRESH_TOKENS } from '@/graphql/auth.gql';
import signinWithGoogleLink from '@/utils/signinWithGoogleLink';
import { ActionIcon, Button, Flex, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { IconBrandGoogle, IconCheck, IconEdit, IconKey } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useMutation } from 'urql';
type AccountDetailsType = {};
const AccountDetails = ({}: AccountDetailsType) => {
  const { data: uData } = useCurrentUser();
  const [{ fetching, data }, deleteRefreshToken] = useMutation(DELETE_REFRESH_TOKENS);
  // const form = useForm({
  //   initialValues: {
  //     firstName: uData?.first_name,
  //     lastName: uData?.last_name,
  //     username: uData?.username,
  //     city: uData?.city?.id,
  //   },
  // });
  return (
    <Stack>
      <Stack>
        <Text fw={500} c={'gray.7'} size="xl">
          Email & Password
        </Text>
        <Stack gap={'xs'}>
          <TextInput readOnly label="Email" value={uData?.email} />
          <PasswordInput
            readOnly
            value={'**********'}
            label="Current Password"
            visible={false}
            rightSection={
              <ActionIcon variant="white">
                <IconEdit />
              </ActionIcon>
            }
          />
        </Stack>
      </Stack>
      <Stack>
        <Text fw={500} c={'gray.7'} size="xl">
          Social Login
        </Text>
        <Stack gap={'xs'}>
          <Flex justify={'space-between'}>
            <Flex gap={'sm'}>
              <IconBrandGoogle />
              <Text>Google</Text>
            </Flex>
            {uData?.google_id ? (
              <Button leftSection={<IconCheck />} variant="light" color="green" size="xs">
                Connected
              </Button>
            ) : (
              <Button
                component="a"
                href={signinWithGoogleLink(uData?.email)}
                variant="light"
                color="blue"
                size="xs"
              >
                Connect
              </Button>
            )}
          </Flex>
        </Stack>
      </Stack>
      <Stack>
        <Text fw={500} c={'gray.7'} size="xl">
          Sessions
        </Text>
        <Stack gap={'xs'}>
          {uData?.refresh_tokens?.map((token) => {
            return (
              <Flex key={token.id} justify={'space-between'}>
                <Flex gap={'sm'}>
                  <IconKey />
                  <Text>
                    {token.client} (expires {dayjs(token.expires_at).format('D MMM YY hh:mm a')})
                  </Text>
                </Flex>
                <Button
                  loading={
                    data?.delete_refresh_tokens?.returning?.find((idx) => idx.id === token.id)
                      ? fetching
                      : false
                  }
                  onClick={() => deleteRefreshToken({ where: { id: { _eq: token.id } } })}
                  color="red"
                  variant="light"
                  size="xs"
                >
                  Revoke
                </Button>
              </Flex>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AccountDetails;
