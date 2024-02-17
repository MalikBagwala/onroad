import { Order_By } from '@/gql/graphql';
import { VARIANT_CONTRIBUTIONS } from '@/graphql/variant.gql';
import { Carousel } from '@mantine/carousel';
import { Skeleton } from '@mantine/core';
import { useQuery } from 'urql';
import ContributionSummary from '../ContributionSummary/ContributionSummary';
import styles from './VariantContributions.module.css';
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
        downvotes: Order_By.Asc,
        upvotes: Order_By.DescNullsLast,
        city_id: Order_By.Asc,
        created_at: Order_By.Desc,
      },
    },
  });
  if (!fetching && !data?.contributions?.length) return null;
  return (
    <Skeleton visible={fetching}>
      <Carousel withIndicators slideGap="md" align="center" slideSize={'20%'} slidesToScroll={5}>
        {data?.contributions?.map((contribution) => {
          return (
            <Carousel.Slide className={styles.slide} key={contribution.id}>
              <ContributionSummary contribution={contribution as any} showBreakup={false} />
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </Skeleton>
  );
};

export default VariantContributions;
