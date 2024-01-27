import { Box, BoxProps, CloseButton, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

type UserOnboardWrapperType = BoxProps & {
  children: React.ReactNode;
  title: React.ReactNode;
};
const UserOnboardWrapper = ({ children, title, ...props }: UserOnboardWrapperType) => {
  return (
    <Box pos={'relative'} py={'xl'} px={'lg'} {...props}>
      <Text size="lg" mb={0} ta={'center'} fw={'bold'}>
        {title}
      </Text>
      {children}
      <CloseButton onClick={modals.closeAll} pos={'absolute'} top={0} right={0} />
    </Box>
  );
};

export default UserOnboardWrapper;
