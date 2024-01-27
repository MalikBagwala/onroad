import { graphql } from '@/gql';

export const UPDATE_USER = graphql(/* GraphQL */ `
  mutation update_users_by_pk($_set: users_set_input, $pk_columns: users_pk_columns_input!) {
    update_users_by_pk(_set: $_set, pk_columns: $pk_columns) {
      id
      email
      email_verified
      username
      first_name
      last_name
      avatar
      city {
        id
        name
        state {
          id
          name
        }
      }
    }
  }
`);
