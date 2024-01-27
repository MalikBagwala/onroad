import { Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';
import AddUpdatePricing from '../AddUpdateContribution/AddUpdatePricing';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center">
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'purple' }}>
          OnRoad
        </Text>
      </Title>
      <AddUpdatePricing contribution_id={'125d5161-00f6-46bd-9d26-592943eaebf0'} />
    </>
  );
}
