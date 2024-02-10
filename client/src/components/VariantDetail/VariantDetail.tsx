import { VARIANT_DETAIL } from '@/graphql/variant.gql';
import { titleCase } from '@/utils/titleCase';
import { Badge, Box, Flex, Grid, Pill, SimpleGrid, Stack, Text } from '@mantine/core';
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
            <Grid.Col span={'content'} key={key}>
              <Text size="sm">
                <Text fw={500} component="span" c={'gray.9'}>
                  {titleCase(key)}
                </Text>{' '}
                -{' '}
                <Text component="span" c={'gray.7'}>
                  {String(specfications?.[key]?.name || specfications?.[key])}
                </Text>
              </Text>
            </Grid.Col>
          );
        })}
      </Grid>
    );
  }, [JSON.stringify(specfications)]);

  if (fetching) return <Stack />;
  if (!variant) return <Stack />;
  return (
    <Stack>
      <Flex gap={'md'}>
        <Box bg={'gray.4'}>Images</Box>
        <Stack>
          <Stack>
            <Text fw={500} c={'gray.8'} size="2rem">
              {variant.name}
            </Text>
            <Flex gap={'sm'}>
              <Badge size="sm" variant="gradient">
                {variant.vehicle.type.name}
              </Badge>
              <Badge size="sm">Fuel - {variant.fuel_type}</Badge>
              <Badge size="sm">Transmission - {variant.transmission}</Badge>
            </Flex>
          </Stack>
          <Text size="lg" c={'gray.8'}>
            {variant.description}
          </Text>
          {specificationList}
        </Stack>
      </Flex>
      <Box bg={'gray.6'}>All Contributions</Box>
    </Stack>
  );
};

export default VariantDetail;
