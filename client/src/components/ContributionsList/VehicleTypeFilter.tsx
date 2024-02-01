import { VEHICLE_TYPES } from '@/graphql/filters.gql';
import { Box, Checkbox } from '@mantine/core';
import { ChangeEvent, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'urql';

type VehicleTypeFilterType = {};
const VehicleTypeFilter = ({}: VehicleTypeFilterType) => {
  const [params, setParams] = useSearchParams();
  const queryTypes = params.getAll('type');
  const queryMap = useMemo(() => {
    return queryTypes.reduce<Record<string, boolean>>((acc, curr) => {
      return {
        ...acc,
        [curr]: true,
      };
    }, {});
  }, [queryTypes, queryTypes.length]);
  const [{ data }] = useQuery({
    query: VEHICLE_TYPES,
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
      params.append('type', name);
    } else {
      params.delete('type', name);
    }
    setParams(params);
  };

  return (
    <>
      {data?.vehicle_types?.map((type) => {
        return (
          <Box key={type.id} py={'6px'}>
            <Checkbox
              checked={!!queryMap[type.id]}
              name={type.id}
              onChange={handleChange}
              label={type.name}
            />
          </Box>
        );
      })}
    </>
  );
};

export default VehicleTypeFilter;
