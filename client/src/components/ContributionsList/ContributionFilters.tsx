import { Accordion, Box, Button, Flex, Text, rem } from '@mantine/core';
import { IconCoinRupee, IconGauge, IconRegistered } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PriceFilter from './PriceFilter';
import VehicleMakeFilter from './VehicleMakeFilter';
import VehicleTypeFilter from './VehicleTypeFilter';

type ContributionFiltersType = {};
const ContributionFilters = ({}: ContributionFiltersType) => {
  const navigate = useNavigate();
  return (
    <Box
      bg="white"
      miw={400}
      style={{
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 'var(--mantine-radius-default)',
        overflow: 'hidden',
        height: 'fit-content',
      }}
    >
      <Flex justify={'space-between'} py="xs" px={'sm'}>
        <Text fw={600}>Filters</Text>
        <Button
          onClick={() => {
            navigate({
              search: '',
            });
          }}
          variant="subtle"
          size="xs"
        >
          Clear All
        </Button>
      </Flex>

      <Accordion defaultValue={'price'} variant="contained">
        <Accordion.Item
          style={{
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderLeft: 'none',
            borderRight: 'none',
          }}
          value="price"
        >
          <Accordion.Control icon={<IconCoinRupee style={{ width: rem(16), height: rem(16) }} />}>
            <Text fw={600} size="xs" tt={'uppercase'}>
              price
            </Text>
          </Accordion.Control>
          <Accordion.Panel pb={'lg'} px={'lg'}>
            <PriceFilter />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          style={{
            borderLeft: 'none',
            borderRight: 'none',
          }}
          value="type"
        >
          <Accordion.Control icon={<IconGauge style={{ width: rem(16), height: rem(16) }} />}>
            <Text fw={600} size="xs" tt={'uppercase'}>
              type
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <VehicleTypeFilter />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          style={{
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
          }}
          value="makes"
        >
          <Accordion.Control icon={<IconRegistered style={{ width: rem(16), height: rem(16) }} />}>
            <Text fw={600} size="xs" tt={'uppercase'}>
              make
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <VehicleMakeFilter />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

export default ContributionFilters;
