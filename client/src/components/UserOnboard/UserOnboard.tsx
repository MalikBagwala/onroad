import { Box, Button, CloseButton, Input, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

export const UserOnboard = () => {
  return (
    <Box pos={'relative'} py={'xl'} px={'lg'}>
      <Text size="lg" mb={'md'} ta={'center'} fw={'bold'}>
        Create an Account Or Sign In
      </Text>
      <Input.Wrapper id="email" label="E-Mail">
        <Input id="email" placeholder="Your email" type="email" />
      </Input.Wrapper>
      <Button fullWidth mt="md">
        Continue With Email
      </Button>
      <CloseButton onClick={modals.closeAll} pos={'absolute'} top={0} right={0} />
    </Box>
  );
};
