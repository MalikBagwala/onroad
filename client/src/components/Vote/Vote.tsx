import { Votes_Constraint, Votes_Update_Column } from '@/gql/graphql';
import { INSERT_VOTE_ONE } from '@/graphql/contribution.gql';
import { convertToCompact } from '@/utils/convertToInr';
import { ActionIcon, Flex, Text } from '@mantine/core';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react';
import { useMutation } from 'urql';

type VoteType = {
  upvotes: number;
  downvotes: number;
  contributionId: number;
  disableVoting?: boolean;
};
const Vote = ({
  upvotes,
  downvotes,
  contributionId: contribution_id,
  disableVoting: disable_voting = false,
}: VoteType) => {
  const [{ fetching }, insertVote] = useMutation(INSERT_VOTE_ONE);

  const handleSubmit = (type: 'UP' | 'DN') => {
    return async () => {
      if (disable_voting || fetching) return;
      await insertVote({
        object: { contribution_id, type },
        on_conflict: {
          constraint: Votes_Constraint.VotesContributionIdUserIdC683cc92Uniq,
          update_columns: [Votes_Update_Column.Type],
        },
      });
    };
  };
  return (
    <Flex gap={'0.5rem'}>
      <Flex align={'center'}>
        {disable_voting ? null : (
          <ActionIcon onClick={handleSubmit('UP')} size={'sm'} variant="transparent" c={'gray.7'}>
            <IconThumbUp stroke={1} />{' '}
          </ActionIcon>
        )}
        <Text fw={300}>{convertToCompact(upvotes)}</Text>
      </Flex>
      <Flex align={'center'}>
        {disable_voting ? null : (
          <ActionIcon onClick={handleSubmit('DN')} size={'sm'} variant="transparent" c={'gray.7'}>
            <IconThumbDown stroke={1} />
          </ActionIcon>
        )}
        <Text fw={300}>{convertToCompact(downvotes)}</Text>
      </Flex>
    </Flex>
  );
};

export default Vote;
