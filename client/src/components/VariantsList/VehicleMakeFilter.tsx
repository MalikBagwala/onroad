import { MAKES } from '@/graphql/filters.gql';
import { Box, Checkbox } from '@mantine/core';
import { ChangeEvent, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'urql';

type VehicleMakeFilterType = {};
const VehicleMakeFilter = ({}: VehicleMakeFilterType) => {
  const [params, setParams] = useSearchParams();
  const queryTypes = params.getAll('make');
  const queryMap = useMemo(() => {
    return queryTypes.reduce<Record<string, boolean>>((acc, curr) => {
      return {
        ...acc,
        [curr]: true,
      };
    }, {});
  }, [queryTypes, queryTypes.length]);
  const [{ data }] = useQuery({
    query: MAKES,
    variables: {
      where: {
        vehicles: {
          variants: {
            contributions: {},
          },
        },
      },
    },
  });
  const handleChange = ({ target: { name, checked } }: ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      params.append('make', name);
    } else {
      params.delete('make', name);
    }
    setParams(params);
  };
  return (
    <>
      {data?.makes?.map((make) => {
        const uniqueKey = make.code as string;
        return (
          <Box key={uniqueKey} py={'6px'}>
            <Checkbox
              checked={!!queryMap[uniqueKey]}
              name={uniqueKey}
              onChange={handleChange}
              label={make.name}
            />
          </Box>
        );
      })}
    </>
  );
};

export default VehicleMakeFilter;
