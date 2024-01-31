import { Box, Flex, Grid } from '@mantine/core';
import ContributionFilters from './ContributionFilters';

type ContributionsListType = {};
const ContributionsList = ({}: ContributionsListType) => {
  return (
    <Flex>
      <ContributionFilters />
      <Box>List</Box>
    </Flex>
  );
};

export default ContributionsList;
