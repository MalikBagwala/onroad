import { MAKES, VEHICLE_TYPES } from '@/graphql/filters.gql';
import { Accordion, Box, Checkbox, Text, rem } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { useQuery } from 'urql';
import PriceFilter from './PriceFilter';

type ContributionFiltersType = {};
const ContributionFilters = ({}: ContributionFiltersType) => {
  const [{ data }] = useQuery({ query: VEHICLE_TYPES });
  const [{ data: mData }] = useQuery({ query: MAKES });

  return (
    <Box bg="white" miw={400}>
      <Box py="xs" px={'sm'}>
        <Text fw={500}>Filters</Text>
      </Box>

      <Accordion variant="contained">
        <Accordion.Item value="price">
          <Accordion.Control icon={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}>
            <Text fw={600} size="xs" tt={'uppercase'}>
              {' '}
              price
            </Text>
          </Accordion.Control>
          <Accordion.Panel pb={'lg'} px={'lg'}>
            <PriceFilter />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="type">
          <Accordion.Control icon={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}>
            <Text fw={600} size="xs" tt={'uppercase'}>
              {' '}
              type
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            {data?.vehicle_types?.map((type) => {
              return (
                <Box key={type.id} py={'6px'}>
                  <Checkbox label={type.name} />
                </Box>
              );
            })}
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="makes">
          <Accordion.Control icon={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}>
            <Text fw={600} size="xs" tt={'uppercase'}>
              {' '}
              make
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            {mData?.makes?.map((type) => {
              return (
                <Box key={type.id} py={'6px'}>
                  <Checkbox label={type.name} />
                </Box>
              );
            })}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

export default ContributionFilters;
