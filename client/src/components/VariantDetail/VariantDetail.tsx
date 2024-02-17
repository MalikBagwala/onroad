import { VARIANT_DETAIL } from '@/graphql/variant.gql';
import convertToInr from '@/utils/convertToInr';
import { titleCase } from '@/utils/titleCase';
import { Badge, Box, Flex, Grid, Paper, Pill, Stack, Table, Text } from '@mantine/core';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';
import VariantContributions from '../VariantContributions/VariantContributions';
import VariantImages from '../VariantImages/VariantImages';
import Vote from '../Vote/Vote';
import { useCurrentUser } from '@/authentication/AuthContext';
import ContributionSummary from '../ContributionSummary/ContributionSummary';

type VariantDetailType = {};
const VariantDetail = ({}: VariantDetailType) => {
  const { data: uData } = useCurrentUser();
  const prefferedCity = uData?.city?.id;
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
        <Paper
          style={{
            overflow: 'hidden',
          }}
          withBorder
          radius={'md'}
          w={'40%'}
          h={'max-content'}
        >
          <VariantImages
            imageProps={{
              height: 300,
            }}
            variant={variant}
          />
        </Paper>
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
          {contribution ? (
            <ContributionSummary contribution={contribution} />
          ) : (
            <Text size="lg">No Pricing Data Available for this variant</Text>
          )}
          <Box>{specificationList}</Box>
        </Stack>
      </Flex>
      <VariantContributions
        variantId={variant.id}
        excludeContributions={contribution?.id ? [contribution.id] : []}
        prefferedCity={prefferedCity}
      />
    </Stack>
  );
};

export default VariantDetail;
