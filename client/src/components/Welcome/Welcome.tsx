import { Button, Text, Title } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import classes from './Welcome.module.css';

export function Welcome() {
  const [params, setParams] = useSearchParams();
  return (
    <>
      <Title className={classes.title} ta="center">
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'purple' }}>
          OnRoad
        </Text>
      </Title>
    </>
  );
}
