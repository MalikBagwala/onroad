import { Select, SelectProps } from '@mantine/core';
import { useQuery } from 'urql';

type QuerySelectType = SelectProps & {
  query: any;
  variables?: any;
  groupBy?: (item: any) => string;
};
const QuerySelect = ({ query, variables, ...props }: QuerySelectType) => {
  const [{ fetching, data }] = useQuery({ query, variables });

  if (fetching || !data) return <Select disabled={fetching} {...props} />;
  const listData: any[] = [];
  const listKey = Object.keys(data)[0];
  const list = data[listKey] || [];
  for (const item of list) {
    listData?.push({
      label: item.name,
      value: item.id,
    });
  }

  return <Select searchable disabled={fetching} data={listData} {...props} />;
};

export default QuerySelect;
