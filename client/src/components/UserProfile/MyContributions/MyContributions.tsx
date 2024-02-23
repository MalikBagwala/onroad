import Vote from '@/components/Vote/Vote';
import { Order_By } from '@/gql/graphql';
import { CONTRIBUTIONS_BRIEF, MY_CONTRIBUTIONS } from '@/graphql/contribution.gql';
import convertToInr from '@/utils/convertToInr';
import { Card, Flex, Group, Pill, ScrollArea, Skeleton, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useQuery } from 'urql';
type MyContributionsType = {};
const MyContributions = ({}: MyContributionsType) => {
  const [{ fetching: iFetching, data: iData }] = useQuery({ query: MY_CONTRIBUTIONS });
  const contributionIds = iData?.myContributions?.data;

  const [{ data, fetching }] = useQuery({
    query: CONTRIBUTIONS_BRIEF,
    variables: {
      where: {
        id: {
          _in: contributionIds,
        },
      },
      order_by: {
        created_at: Order_By.DescNullsLast,
      },
    },
    pause: iFetching,
  });
  return (
    <Stack>
      <Stack>
        <Text fw={500} c={'gray.7'} size="xl">
          My Contributions
        </Text>
        <Stack gap={'xs'}>
          {fetching ? (
            <>
              <Skeleton visible>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, officia laboriosam
                iure dicta similique ducimus suscipit veniam, amet quidem, sint sapiente quasi. At
                debitis illum totam, nobis nostrum, officia amet perspiciatis iusto animi aliquam
                itaque velit, sint eligendi quas perferendis.
              </Skeleton>
              <Skeleton visible>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, officia laboriosam
                iure dicta similique ducimus suscipit veniam, amet quidem, sint sapiente quasi. At
                debitis illum totam, nobis nostrum, officia amet perspiciatis iusto animi aliquam
                itaque velit, sint eligendi quas perferendis.
              </Skeleton>
              <Skeleton visible>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, officia laboriosam
                iure dicta similique ducimus suscipit veniam, amet quidem, sint sapiente quasi. At
                debitis illum totam, nobis nostrum, officia amet perspiciatis iusto animi aliquam
                itaque velit, sint eligendi quas perferendis.
              </Skeleton>
              <Skeleton visible>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, officia laboriosam
                iure dicta similique ducimus suscipit veniam, amet quidem, sint sapiente quasi. At
                debitis illum totam, nobis nostrum, officia amet perspiciatis iusto animi aliquam
                itaque velit, sint eligendi quas perferendis.
              </Skeleton>
            </>
          ) : (
            <ScrollArea h={600}>
              {data?.contributions?.map((contribution) => {
                return (
                  <Card mb={'sm'} radius={'md'} bg={'gray.0'} key={contribution.id}>
                    <Flex justify={'space-between'}>
                      <Pill bg="blue.0">
                        {dayjs(contribution.created_at).format('MMMM DD, YYYY')}
                      </Pill>
                      <Vote
                        contributionId={contribution.id}
                        upvotes={contribution.upvotes}
                        downvotes={contribution.downvotes}
                      />
                    </Flex>
                    <Flex mt="xs" justify={'space-between'}>
                      <Link className="link" to={`/contributions/${contribution.id}`}>
                        <Text c="gray.7" fw={500} size="lg" maw={350} truncate>
                          {contribution.variant?.name} (
                          {contribution.variant_color?.name || 'No Color'})
                        </Text>
                      </Link>
                      <Group>
                        <Text c="gray.9" fw={500} size="lg">
                          {convertToInr(contribution.total)}
                        </Text>
                      </Group>
                    </Flex>
                  </Card>
                );
              })}
            </ScrollArea>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MyContributions;
