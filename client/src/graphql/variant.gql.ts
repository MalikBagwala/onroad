import { graphql } from '@/gql';

export const VARIANTS = graphql(/* GraphQL */ `
  query variants(
    $distinct_on: [variants_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [variants_order_by!]
    $where: variants_bool_exp
  ) {
    variants(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      name
      manufacturer_link
      vehicle {
        id
        name
      }
    }
  }
`);

export const VARIANT_COLORS = graphql(/* GraphQL */ `
  query variant_colors(
    $distinct_on: [variant_colors_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [variant_colors_order_by!]
    $where: variant_colors_bool_exp
  ) {
    variant_colors(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      name
      hex_code
    }
  }
`);

export const VARIANTS_LIST = graphql(/* GraphQL */ `
  query variantsList(
    $distinct_on: [variants_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [variants_order_by!]
    $where: variants_bool_exp
  ) {
    variants(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      name
      manufacturer_link
      colors {
        id
        attachments {
          id
          attachment {
            id
            url
          }
        }
      }
      vehicle {
        id
        type {
          id
          name
        }
      }
      short_description
      contributions_aggregate {
        aggregate {
          avg {
            total
          }
        }
      }
    }
    variants_aggregate(distinct_on: $distinct_on, order_by: $order_by, where: $where) {
      aggregate {
        count
      }
    }
  }
`);
