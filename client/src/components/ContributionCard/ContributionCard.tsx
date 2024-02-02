import { VariantsListQuery } from '@/gql/graphql';
import convertToInr from '@/utils/convertToInr';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './ContributionCard.module.css';
import placeholder from '@/images/vehicle_placeholder.webp';

type ContributionCardType = {
  variant?: VariantsListQuery['variants'][0];
};
function ContributionCard({ variant }: ContributionCardType) {
  const total = variant?.contributions_aggregate?.aggregate?.avg?.total || 0;
  const images = [];
  for (const color of variant?.colors || []) {
    images.push(...color.attachments.map(({ attachment }) => attachment.url));
  }
  if (images.length === 0) {
    images.push(placeholder);
  }

  const slides = images.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} height={220} />
    </Carousel.Slide>
  ));

  return (
    <Card radius="sm" withBorder padding="xl">
      <Card.Section pos={'relative'}>
        <Carousel
          withIndicators
          loop
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
        >
          {slides}
        </Carousel>
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
          <div>
            <Tooltip withArrow label={convertToInr(total, 0)}>
              <Text fz="xl" span fw={600} className={classes.price}>
                {convertToInr(total, 0, 'compact')}
              </Text>
            </Tooltip>
            <Text span fz="sm" c="dimmed">
              {' '}
              / onroad
            </Text>
          </div>

          <Group>
            <Button component={Link} to={`/variants/${variant?.id}`} radius="md">
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
