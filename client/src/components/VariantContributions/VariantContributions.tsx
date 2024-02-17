import { Order_By } from '@/gql/graphql';
import { VARIANT_CONTRIBUTIONS } from '@/graphql/variant.gql';
import { Box, Flex, Skeleton } from '@mantine/core';
import { useQuery } from 'urql';
import ContributionSummary from '../ContributionSummary/ContributionSummary';

type VariantContributionsType = {
  variantId: string;
  excludeContributions?: string[];
  prefferedCity?: string;
};
const VariantContributions = ({ variantId, excludeContributions }: VariantContributionsType) => {
  const [{ fetching, data }] = useQuery({
    query: VARIANT_CONTRIBUTIONS,
    variables: {
      where: {
        variant_id: {
          _eq: variantId,
        },
        id: {
          _nin: excludeContributions,
        },
      },
      order_by: {
        upvotes: Order_By.DescNullsLast,
        city_id: Order_By.Asc,
        created_at: Order_By.Desc,
      },
    },
  });
  return (
    <Skeleton visible={fetching}>
      <Flex gap={'sm'}>
        {data?.contributions?.map((contribution) => {
          return (
            <ContributionSummary
              key={contribution.id}
              contribution={contribution as any}
              showBreakup={false}
            />
          );
        })}
      </Flex>
    </Skeleton>
  );
};

export default VariantContributions;
