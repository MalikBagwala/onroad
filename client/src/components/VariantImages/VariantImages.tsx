import { VariantDetailQuery } from '@/gql/graphql';
import classes from './VariantImages.module.css';
import { Carousel } from '@mantine/carousel';
import { Image, ImageProps } from '@mantine/core';
import placeholder from '@/images/vehicle_placeholder.webp';
import { PolymorphicComponentProps } from '@mantine/core/lib/core/factory/create-polymorphic-component';
import { CarouselSlideProps } from '@mantine/carousel/lib/CarouselSlide/CarouselSlide';

type VariantImagesType = {
  variant: Partial<VariantDetailQuery['variants'][0]>;
  imageProps?: PolymorphicComponentProps<'img', ImageProps>;
  slideProps?: CarouselSlideProps;
};
const VariantImages = ({ variant, imageProps, slideProps }: VariantImagesType) => {
  const images = [];
  for (const color of variant?.colors || []) {
    images.push(
      ...color.attachments
        .filter(({ attachment }) => attachment?.url)
        ?.map(({ attachment }) => attachment.url)
    );
  }
  if (images.length === 0) {
    images.push(placeholder);
  }

  const slides = images.map((image) => (
    <Carousel.Slide key={image} {...slideProps}>
      <Image
        fallbackSrc={placeholder}
        src={image}
        height={imageProps?.height || 220}
        {...imageProps}
      />
    </Carousel.Slide>
  ));

  return (
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
  );
};

export default VariantImages;
