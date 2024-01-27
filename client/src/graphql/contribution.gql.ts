import { graphql } from '@/gql';

export const CONTRIBUTIONS = graphql(/* GraphQL */ `
  query contributions(
    $distinct_on: [contributions_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [contributions_order_by!]
    $where: contributions_bool_exp
  ) {
    contributions(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      created_at
      updated_at
      quoted_on
      dealership_name
      city {
        id
        name
      }
      variant {
        id
        name
      }
      variant_color {
        id
        name
      }
      upvotes
      downvotes
      total
      items {
        id
        serial_no
        price_item {
          id
          name
          type
        }
        value
      }
    }
  }
`);
export const ADD_UPDATE_CONTRIBUTION = graphql(/* GraphQL */ `
  mutation add_update_contribution(
    $object: contributions_insert_input!
    $on_conflict: contributions_on_conflict
  ) {
    insert_contributions_one(object: $object, on_conflict: $on_conflict) {
      id
      created_at
      updated_at
      quoted_on
      dealership_name
      city {
        id
        name
      }
      variant {
        id
        name
      }
      variant_color {
        id
        name
      }
      upvotes
      downvotes
      total
      items {
        id
        serial_no
        price_item {
          id
          name
          type
        }
        value
      }
    }
  }
`);

export const PRICE_ITEMS = graphql(/* GraphQL */ `
  query price_items(
    $distinct_on: [price_items_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [price_items_order_by!]
    $where: price_items_bool_exp
  ) {
    price_items(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      name
      type
    }
  }
`);

export const DELETE_PRICE_ITEMS = graphql(/* GraphQL */ `
  mutation delete_price_items($where: price_items_bool_exp!) {
    delete_price_items(where: $where) {
      returning {
        id
        name
      }
      affected_rows
    }
  }
`);
