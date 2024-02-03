import { VARIANTS } from '@/graphql/variant.gql';
import { Loader, Select, rem, useMantineTheme } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'urql';
type VariantSearchType = {};
const VariantSearch = ({ ...props }: VariantSearchType) => {
  const navigate = useNavigate();
  const [dropdownOpened, { open, close }] = useDisclosure();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue] = useDebouncedValue(searchValue, 500);
  const [{ fetching, data }] = useQuery({
    query: VARIANTS,
    variables: {
      limit: 15,
      where: {
        ...(debouncedValue && {
          name: {
            _ilike: debouncedValue ? `%${debouncedValue}%` : '%%',
          },
        }),
      },
    },
  });

  let listData: any[] = [];
  for (const variant of data?.variants || []) {
    const listGroup = listData.find((item) => item.group === variant.vehicle.name);
    if (!listGroup) {
      listData.push({
        group: variant.vehicle.name,
        items: [{ label: variant.name, value: variant.slug }],
      });
    } else {
      listGroup?.items.push({ label: variant.name, value: variant.slug });
    }
  }
  return (
    <Select
      w={450}
      searchable
      limit={20}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onChange={(_, option) => {
        close();
        setSearchValue('');
        navigate({ pathname: `/variants/${option.value}` });
      }}
      placeholder="Search For Variants"
      data={listData}
      leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
      rightSection={fetching && <Loader size={'sm'} />}
      onDropdownOpen={open}
      dropdownOpened={dropdownOpened}
      onDropdownClose={close}
      {...props}
    />
  );
};

export default VariantSearch;
