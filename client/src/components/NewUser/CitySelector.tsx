import { CITIES } from '@/graphql/auth.gql';
import { Select, SelectProps } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from 'urql';
type CitySelectorType = SelectProps & {};
const CitySelector = ({ ...props }: CitySelectorType) => {
  const [searchValue, setSearchValue] = useState('');
  const [{ fetching, data }] = useQuery({
    query: CITIES,
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
  for (const city of data?.cities || []) {
    const listGroup = listData.find((item) => item.group === city.state.name);
    if (!listGroup) {
      listData.push({
        group: city.state.name,
        items: [{ label: city.name, value: city.id }],
      });
    } else {
      listGroup?.items.push({ label: city.name, value: city.id });
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

export default CitySelector;
