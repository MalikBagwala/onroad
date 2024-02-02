import { PRICE_FILTER } from '@/graphql/filters.gql';
import convertToInr from '@/utils/convertToInr';
import debounce from '@/utils/debounce';
import { RangeSlider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'urql';

type PriceFilterType = {};
const PriceFilter = ({}: PriceFilterType) => {
  const [params, setParams] = useSearchParams();
  const [{ data }] = useQuery({
    query: PRICE_FILTER,
  });
  const aggregate = data?.contributions_aggregate?.aggregate;
  const minPrice = aggregate?.min?.total || 0;
  const maxPrice = aggregate?.max?.total || 0;
  const queryMinPrice = Number(params.get('minPrice'));
  const queryMaxPrice = Number(params.get('maxPrice'));

  const [value, setValue] = useState<[number, number]>([
    queryMinPrice || minPrice,
    queryMaxPrice || maxPrice,
  ]);
  const numberOfMarks = 6;

  // Calculate the step size
  const stepSize = (maxPrice - minPrice) / (numberOfMarks - 1);

  // Generate the 6 equal marks
  const marks = Array.from({ length: numberOfMarks }, (_, index): any => {
    const markVal = minPrice + index * stepSize;
    const currency = convertToInr(markVal, 0, 'compact');
    return {
      value: minPrice + index * stepSize,
      label: currency,
    };
  });

  const debouncedChanged = debounce((value) => {
    params.set('minPrice', value[0]);
    params.set('maxPrice', value[1]);
    setParams(params);
  }, 500);

  useEffect(() => {
    if (!queryMinPrice || !queryMaxPrice) {
      setValue([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice, queryMinPrice, queryMaxPrice]);
  return (
    <RangeSlider
      value={value}
      onChange={(value) => {
        setValue(value);
        debouncedChanged(value);
      }}
      label={(value) => convertToInr(value, 0)}
      min={minPrice}
      max={maxPrice}
      marks={marks}
    />
  );
};

export default PriceFilter;
