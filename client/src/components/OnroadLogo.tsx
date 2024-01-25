import logo from '../favicon.png';
import { Flex, Text, Image, TextProps } from '@mantine/core';
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
  return (
    <Flex align={'center'} gap={'4px'}>
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
