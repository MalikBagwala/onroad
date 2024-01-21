import { graphql } from '@/gql';

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
