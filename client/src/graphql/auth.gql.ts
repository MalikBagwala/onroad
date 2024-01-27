import { graphql } from '@/gql';

export const CURRENT_USER = graphql(/* GraphQL */ `
  query currentUser {
    users {
      id
      email
      username
      first_name
      last_name
      avatar
      has_contributed
      email_verified
      google_id
      refresh_tokens {
        id
        client
        expires_at
        created_at
      }
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

export const MEMBERSHIP_TYPE = graphql(/* GraphQL */ `
  query membershipTypeByEmail($email: String!) {
    membershipTypeByEmail(email: $email) {
      message
      data
    }
  }
`);

export const LOGIN = graphql(/* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      code
      data {
        accessToken
        refreshToken
      }
      message
    }
  }
`);

export const LOGIN_WITH_MAGIC_LINK = graphql(/* GraphQL */ `
  mutation loginWithMagicLink($email: String!) {
    loginWithMagicLink(email: $email) {
      code
      data
      message
    }
  }
`);
export const REGISTER = graphql(/* GraphQL */ `
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      data {
        user {
          id
          email
        }
        tokens {
          accessToken
          refreshToken
        }
      }
      success
      message
      errors
    }
  }
`);

export const SEND_EMAIL_OTP = graphql(/* GraphQL */ `
  mutation sendEmailOtp($email: String!) {
    sendEmailOtp(email: $email) {
      code
      data
      message
    }
  }
`);

export const VERIFY_EMAIL_OTP = graphql(/* GraphQL */ `
  mutation verifyOtp($input: OtpInput!) {
    verifyOtp(input: $input) {
      code
      message
      data
    }
  }
`);

export const REFRESH_TOKEN = graphql(/* GraphQL */ `
  mutation refreshToken($refreshToken: UUID!) {
    refreshToken(refreshToken: $refreshToken) {
      code
      data
      message
    }
  }
`);

export const FORGOT_PASSWORD = graphql(/* GraphQL */ `
  mutation forgotPassword($identity: String!) {
    forgotPassword(identity: $identity) {
      code
      data
      success
      message
    }
  }
`);

export const FORGOT_PASSWORD_CONFIRM = graphql(/* GraphQL */ `
  mutation forgotPasswordConfirm($input: ForgotPasswordConfirmInput!) {
    forgotPasswordConfirm(input: $input) {
      data {
        accessToken
        refreshToken
      }
      success
      code
      message
    }
  }
`);

export const DELETE_REFRESH_TOKENS = graphql(/* GraphQL */ `
  mutation delete_refresh_tokens($where: refresh_tokens_bool_exp!) {
    delete_refresh_tokens(where: $where) {
      returning {
        id
        client
      }
      affected_rows
    }
  }
`);

export const CITIES = graphql(/* GraphQL */ `
  query cities(
    $distinct_on: [cities_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [cities_order_by!]
    $where: cities_bool_exp
  ) {
    cities(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      name
      state {
        id
        name
      }
    }
  }
`);
