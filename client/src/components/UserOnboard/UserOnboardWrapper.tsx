import { Box, BoxProps, CloseButton, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';

type UserOnboardWrapperType = BoxProps & {
  children: React.ReactNode;
  title: React.ReactNode;
};
const UserOnboardWrapper = ({ children, title, ...props }: UserOnboardWrapperType) => {
  const navigate = useNavigate();
  return (
    <Box pos={'relative'} py={'xl'} px={'lg'} {...props}>
      <Text size="lg" mb={0} ta={'center'} fw={'bold'}>
        {title}
      </Text>
      {children}
      <CloseButton
        onClick={() => {
          modals.closeAll();
          navigate({ search: '' }, { replace: true });
        }}
        pos={'absolute'}
        top={0}
        right={0}
      />
    </Box>
  );
};

export default UserOnboardWrapper;
