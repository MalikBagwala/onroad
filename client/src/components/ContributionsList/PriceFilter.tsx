import { PRICE_FILTER } from '@/graphql/filters.gql';
import convertToInr from '@/utils/convertToInr';
import { RangeSlider } from '@mantine/core';
import { useQuery } from 'urql';

type PriceFilterType = {};
const PriceFilter = ({}: PriceFilterType) => {
  const [{ data }] = useQuery({
    query: PRICE_FILTER,
  });
  const aggregate = data?.contributions_aggregate?.aggregate;
  const minPrice = aggregate?.min?.total || 0;
  const maxPrice = aggregate?.max?.total || 0;
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
  return (
    <RangeSlider
      label={(value) => convertToInr(value, 0)}
      min={minPrice}
      max={maxPrice}
      marks={marks}
    />
  );
};

export default PriceFilter;
