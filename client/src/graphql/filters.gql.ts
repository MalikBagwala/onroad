import { graphql } from '@/gql';

export const VEHICLE_TYPES = graphql(/* GraphQL */ `
  query vehicle_types(
    $distinct_on: [vehicle_types_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [vehicle_types_order_by!]
    $where: vehicle_types_bool_exp
  ) {
    vehicle_types(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      name
      code
    }
  }
`);

export const MAKES = graphql(/* GraphQL */ `
  query makes(
    $distinct_on: [makes_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [makes_order_by!]
    $where: makes_bool_exp
  ) {
    makes(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      name
      code
    }
  }
`);

export const PRICE_FILTER = graphql(/* GraphQL */ `
  query price_filter {
    contributions_aggregate {
      aggregate {
        min {
          total
        }
        max {
          total
        }
      }
    }
  }
`);
