import { VARIANTS } from '@/graphql/variant.gql';
import { Select, SelectProps } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from 'urql';
type VariantSelectorType = SelectProps & {};
const VariantSelector = ({ ...props }: VariantSelectorType) => {
  const [searchValue, setSearchValue] = useState('');
  const [{ fetching, data }] = useQuery({
    query: VARIANTS,
    variables: {
      //   limit: 100,
      where: {
        // ...(searchValue && {
        //   name: {
        //     _ilike: searchValue || '',
        //   },
        // }),
      },
    },
  });

  let listData: any[] = [];
  for (const variant of data?.variants || []) {
    const listGroup = listData.find((item) => item.group === variant.vehicle.name);
    if (!listGroup) {
      listData.push({
        group: variant.vehicle.name,
        items: [{ label: variant.name, value: variant.id }],
      });
    } else {
      listGroup?.items.push({ label: variant.name, value: variant.id });
    }
  }
  return (
    <Select
      limit={100}
      searchable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      disabled={fetching}
      label="City"
      description="This is used to show you relevant prices"
      data={listData}
      {...props}
    />
  );
};

export default VariantSelector;
