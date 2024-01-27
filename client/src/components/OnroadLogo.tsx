import { Flex, Image, Text, TextProps } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import logo from '../favicon.png';
type OnRoadLogoType = {
  height?: number;
  width?: number;
  withText?: boolean;
  withImage?: boolean;
  textProps?: TextProps;
};
const OnRoadLogo = ({
  height = 24,
  width = 24,
  withText = true,
  textProps,
  withImage = true,
}: OnRoadLogoType) => {
  const navigate = useNavigate();
  return (
    <Flex style={{ cursor: 'pointer' }} onClick={() => navigate('/')} align={'center'} gap={'4px'}>
      {withImage && <Image src={logo} width={width} height={height} />}
      {withText && (
        <Text fw={500} {...textProps}>
          OnRoad
        </Text>
      )}
    </Flex>
  );
};

export default OnRoadLogo;
