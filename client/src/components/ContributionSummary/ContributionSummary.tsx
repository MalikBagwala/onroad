import { VariantDetailQuery } from '@/gql/graphql';
import convertToInr from '@/utils/convertToInr';
import { Flex, Paper, Pill, Stack, Table, Text } from '@mantine/core';
import Vote from '../Vote/Vote';
import RelativeTime from '../RelativeTime/RelativeTime';

type ContributionSummaryType = {
  contribution: VariantDetailQuery['variants'][0]['contributions'][0];
  showBreakup?: boolean;
  disableVoting?: boolean;
};
const ContributionSummary = ({
  contribution,
  showBreakup = true,
  disableVoting = false,
}: ContributionSummaryType) => {
  return (
    <Paper c={'gray.8'} fw={500} p={'sm'} w={'20rem'} shadow="xs">
      <Flex align={'center'}>
        <Text my={'xs'} ta={'center'} fw={600} size="1.9rem">
          {convertToInr(contribution.total, 0)}{' '}
        </Text>
        <Pill ml={'xs'} bg={'grape.1'}>
          {contribution.city.name}
        </Pill>
      </Flex>
      <Stack w={'100%'} gap={'0.5rem'}>
        {showBreakup ? (
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
        ) : null}
        <Flex justify={'space-between'}>
          <Vote
            disableVoting={disableVoting}
            upvotes={contribution.upvotes}
            downvotes={contribution.downvotes}
            contributionId={contribution.id}
          />
          <RelativeTime timestamp={contribution.created_at} />
        </Flex>
      </Stack>
    </Paper>
  );
};

export default ContributionSummary;
