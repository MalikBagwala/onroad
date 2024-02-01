import { Box, Flex } from '@mantine/core';
import ContributionFilters from './ContributionFilters';
import { useQuery } from 'urql';
import { CONTRIBUTIONS_BRIEF } from '@/graphql/contribution.gql';

type ContributionsListType = {};
const ContributionsList = ({}: ContributionsListType) => {
const {} =  useQuery({query:CONTRIBUTIONS_BRIEF})
  return (
    <Flex>
      <ContributionFilters />
      <Box>List</Box>
    </Flex>
  );
};

export default ContributionsList;
