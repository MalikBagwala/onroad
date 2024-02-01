import { Container, createTheme, rem } from '@mantine/core';

const CONTAINER_SIZES: Record<string, string> = {
  sm: rem(500),
  md: rem(1300),
  lg: rem(1300),
  xl: rem(1400),
  xxl: rem(1500),
};

export const theme = createTheme({
  components: {
    Container: Container.extend({
      vars: (_, { size }) => {
        return {
          root: Object.keys(CONTAINER_SIZES).reduce((acc, key) => {
            return {
              ...acc,
              [`--container-size-${key}`]: CONTAINER_SIZES[key],
            };
          }, {}),
        };
      },
    }),
  },
});
