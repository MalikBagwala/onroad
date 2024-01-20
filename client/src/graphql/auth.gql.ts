export const REFRESH_TOKEN = /* GraphQL */ `
  mutation refreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      code
      data
      message
    }
  }
`;

export const CURRENT_USER = /* GraphQL */ `
  query currentUser {
    users {
      id
      email
      first_name
      last_name
    }
  }
`;
