import { VariantsListQuery } from '@/gql/graphql';
import convertToInr from '@/utils/convertToInr';
import { ActionIcon, Badge, Box, Button, Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './ContributionCard.module.css';
import VariantImages from '../VariantImages/VariantImages';

type ContributionCardType = {
  variant?: VariantsListQuery['variants'][0];
};
function ContributionCard({ variant }: ContributionCardType) {
  const most_relevant_contribution = variant?.contributions?.[0];
  const total = most_relevant_contribution?.total || 0;

  return (
    <Card radius="sm" withBorder padding="xl">
      <Card.Section pos={'relative'}>
        <VariantImages variant={variant as any} />
        <Badge
          style={{
            top: 'var(--mantine-spacing-md)',
            right: 'var(--mantine-spacing-md)',
          }}
          pos={'absolute'}
          size="sm"
          variant="gradient"
          gradient={{ from: 'violet', to: 'cyan', deg: 90 }}
        >
          {variant?.vehicle?.type?.name}
        </Badge>
      </Card.Section>

      <Stack h={'100%'} justify="space-between">
        <Box mt="lg">
          <Text c={'gray.8'} fw={500} fz="lg">
            {variant?.name}
          </Text>
          <Text lineClamp={4} fz="sm" c="dimmed" mt="sm">
            {variant?.short_description}
          </Text>
        </Box>

        <Group justify="space-between" mt="md">
          {most_relevant_contribution ? (
            <div>
              <Tooltip withArrow label={convertToInr(total, 0)}>
                <Text fz="xl" span fw={600} className={classes.price}>
                  {convertToInr(total, 0, 'compact')}
                </Text>
              </Tooltip>
              <Text span fz="sm" c="dimmed">
                {' '}
                / {most_relevant_contribution?.city?.name}
              </Text>
            </div>
          ) : (
            <Text fz="xl" span fw={600} className={classes.price}>
              Na
            </Text>
          )}

          <Group>
            <Button component={Link} to={`/variants/${variant?.slug}`} radius="md">
              More Details
            </Button>
            {variant?.manufacturer_link && (
              <ActionIcon
                component="a"
                target="_blank"
                href={variant?.manufacturer_link}
                variant="default"
                radius="md"
                size={36}
              >
                <IconLink className={classes.like} stroke={1.5} />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}

export default ContributionCard;
