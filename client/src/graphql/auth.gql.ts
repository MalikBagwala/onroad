import { graphql } from '@/gql';

export const REFRESH_TOKEN = graphql(/* GraphQL */ `
  mutation refreshToken($refreshToken: UUID!) {
    refreshToken(refreshToken: $refreshToken) {
      code
      data
      message
    }
  }
`);

export const CURRENT_USER = graphql(/* GraphQL */ `
  query currentUser {
    users {
      id
      email
      first_name
      last_name
    }
  }
`);
