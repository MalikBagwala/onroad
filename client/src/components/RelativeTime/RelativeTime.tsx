import { Button, Pill, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';

type RelativeTimeType = {
  timestamp: string;
};
const RelativeTime = ({ timestamp }: RelativeTimeType) => {
  if (!timestamp) return null;
  const d = dayjs(timestamp);
  return (
    <Tooltip label={<span>{d.format('Do MMM YY hh:mm a')}</span>}>
      <Pill bg={'none'}>{d.fromNow()}</Pill>
    </Tooltip>
  );
};

export default RelativeTime;
