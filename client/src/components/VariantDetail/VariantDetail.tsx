import { VARIANT_DETAIL } from '@/graphql/variant.gql';
import convertToInr from '@/utils/convertToInr';
import { titleCase } from '@/utils/titleCase';
import { Badge, Box, Flex, Grid, Paper, Pill, Stack, Table, Text } from '@mantine/core';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';

type VariantDetailType = {};
const VariantDetail = ({}: VariantDetailType) => {
  const { id } = useParams();
  const [{ fetching, data }] = useQuery({ query: VARIANT_DETAIL, variables: { slug: id } });

  const variant = data?.variants?.[0];
  const specfications = variant?.specifications;

  const specificationList = useMemo(() => {
    if (!specfications) return null;
    return (
      <Grid gutter={'xs'}>
        {Object.keys(specfications).map((key) => {
          return (
            <Grid.Col maw={'100%'} span={'content'} key={key}>
              <Flex gap={'3px'}>
                <Text size="sm" display={'inline-block'} fw={500} component="span" c={'gray.6'}>
                  {titleCase(key)}
                </Text>
                <Text size="sm" display={'inline-block'} fw={500} component="span" c={'gray.6'}>
                  -
                </Text>
                <Text
                  size="sm"
                  display={'inline-block'}
                  truncate
                  maw={'100%'}
                  component="span"
                  c={'gray.7'}
                >
                  {String(specfications?.[key]?.name || specfications?.[key])}
                </Text>
              </Flex>
            </Grid.Col>
          );
        })}
      </Grid>
    );
  }, [JSON.stringify(specfications)]);

  if (fetching) return <Stack />;
  if (!variant) return <Stack />;

  const contribution = variant.contributions?.[0];
  return (
    <Stack>
      <Flex w={'100%'} gap={'md'}>
        <Box w={'40%'} bg={'gray.4'}>
          Images
        </Box>
        <Stack w={'60%'}>
          <Stack>
            <Text fw={500} c={'gray.7'} size="2rem">
              {variant.name}
            </Text>
            <Flex gap={'sm'}>
              <Badge size="sm" variant="gradient">
                {variant.vehicle.type.name}
              </Badge>
              <Badge bg={variant.fuel_type === 'EL' ? 'green' : 'red'} size="sm">
                Fuel - {variant.fuel_type}
              </Badge>
              <Badge size="sm">Transmission - {variant.transmission}</Badge>
            </Flex>
          </Stack>
          <Text size="lg" c={'gray.8'}>
            {variant.description}
          </Text>
          <Paper c={'gray.8'} fw={500} p={'sm'} w={'20rem'} shadow="xs">
            <Text my={'xs'} ta={'center'} fw={600} size="1.9rem">
              {convertToInr(contribution.total, 0)} <Pill ml={'xs'}>{contribution.city.name}</Pill>{' '}
            </Text>
            <Stack w={'100%'} gap={'0.5rem'}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Price Item</Table.Th>
                    <Table.Th>Amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {contribution.items.map((item) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td c={'gray.6'}>{item.price_item.name}</Table.Td>
                        <Table.Td c={item.price_item.type === 'CR' ? 'green.9' : 'red.9'}>
                          {convertToInr(item.value, 0)}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Stack>
          </Paper>
          <Box>{specificationList}</Box>
        </Stack>
      </Flex>
      <Box bg={'gray.6'}>All Contributions</Box>
    </Stack>
  );
};

export default VariantDetail;
