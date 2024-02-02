import { VARIANTS_LIST } from '@/graphql/variant.gql';
import { Flex, Grid, Pagination, SimpleGrid, Skeleton } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'urql';
import ContributionCard from '../ContributionCard/ContributionCard';
import ContributionFilters from './ContributionFilters';

type VariantsListType = {};
const VariantsList = ({}: VariantsListType) => {
  const [params, setParams] = useSearchParams();
  const currentPage = Number(params.get('page')) || 1;
  const makes = params.getAll('make');
  const types = params.getAll('type');
  const maxPrice = Number(params.get('maxPrice'));
  const minPrice = Number(params.get('minPrice'));
  const [{ data, fetching }] = useQuery({
    query: VARIANTS_LIST,
    variables: {
      where: {
        contributions: {
          total: {
            ...(minPrice && { _gte: minPrice }),
            ...(maxPrice && { _lte: maxPrice }),
          },
        },
        vehicle: {
          make: makes?.length
            ? {
                code: {
                  _in: makes,
                },
              }
            : undefined,
          type: types?.length
            ? {
                code: {
                  _in: types,
                },
              }
            : undefined,
        },
      },
      limit: 6,
      offset: (currentPage - 1) * 6,
    },
  });
  return (
    <Flex columnGap={'md'}>
      <ContributionFilters />
      <Flex gap={'md'} direction="column">
        <SimpleGrid cols={{ md: 2, sm: 1 }}>
          {fetching ? (
            <>
              <Skeleton visible>
                <ContributionCard />
              </Skeleton>
              <Skeleton visible>
                <ContributionCard />
              </Skeleton>
              <Skeleton visible>
                <ContributionCard />
              </Skeleton>
              <Skeleton visible>
                <ContributionCard />
              </Skeleton>
            </>
          ) : data?.variants?.length ? (
            data?.variants?.map((variant) => {
              return <ContributionCard key={variant.id} variant={variant} />;
            })
          ) : null}
        </SimpleGrid>
        <Pagination
          value={currentPage}
          onChange={(value) => {
            params.set('page', value.toString());
            setParams(params);
          }}
          total={Math.ceil((data?.variants_aggregate?.aggregate?.count || 0) / 6)}
        />
      </Flex>
    </Flex>
  );
};

export default VariantsList;
