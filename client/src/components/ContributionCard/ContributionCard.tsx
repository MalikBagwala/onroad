import { VariantsListQuery } from '@/gql/graphql';
import convertToInr from '@/utils/convertToInr';
import { Carousel } from '@mantine/carousel';
import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './ContributionCard.module.css';

const images = [
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
];

type ContributionCardType = {
  variant?: VariantsListQuery['variants'][0];
};
function ContributionCard({ variant }: ContributionCardType) {
  const total = variant?.contributions_aggregate?.aggregate?.avg?.total || 0;
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

      <Group justify="space-between" mt="lg">
        <Text fw={500} fz="lg">
          {variant?.name}
        </Text>
      </Group>

      <Text fz="sm" c="dimmed" mt="sm">
        {variant?.short_description}
      </Text>

      <Group justify="space-between" mt="md">
        <div>
          <Text fz="xl" span fw={500} className={classes.price}>
            {convertToInr(total, 0)}
          </Text>
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
    </Card>
  );
}

export default ContributionCard;
