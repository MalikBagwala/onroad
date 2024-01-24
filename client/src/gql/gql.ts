/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query currentUser {\n    users {\n      id\n      email\n      first_name\n      last_name\n      avatar\n    }\n  }\n": types.CurrentUserDocument,
    "\n  query membershipTypeByEmail($email: String!) {\n    membershipTypeByEmail(email: $email) {\n      message\n      data\n    }\n  }\n": types.MembershipTypeByEmailDocument,
    "\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      code\n      data {\n        accessToken\n        refreshToken\n      }\n      message\n    }\n  }\n": types.LoginDocument,
    "\n  mutation loginWithMagicLink($email: String!) {\n    loginWithMagicLink(email: $email) {\n      code\n      data\n      message\n    }\n  }\n": types.LoginWithMagicLinkDocument,
    "\n  mutation register($input: RegisterInput!) {\n    register(input: $input) {\n      data {\n        user {\n          id\n          email\n        }\n        tokens {\n          accessToken\n          refreshToken\n        }\n      }\n      success\n      message\n      errors\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation sendEmailOtp($email: String!) {\n    sendEmailOtp(email: $email) {\n      code\n      data\n      message\n    }\n  }\n": types.SendEmailOtpDocument,
    "\n  mutation verifyOtp($input: OtpInput!) {\n    verifyOtp(input: $input) {\n      code\n      message\n      data\n    }\n  }\n": types.VerifyOtpDocument,
    "\n  mutation refreshToken($refreshToken: UUID!) {\n    refreshToken(refreshToken: $refreshToken) {\n      code\n      data\n      message\n    }\n  }\n": types.RefreshTokenDocument,
    "\n  mutation forgotPassword($identity: String!) {\n    forgotPassword(identity: $identity) {\n      code\n      data\n      success\n      message\n    }\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation forgotPasswordConfirm($input: ForgotPasswordConfirmInput!) {\n    forgotPasswordConfirm(input: $input) {\n      data {\n        accessToken\n        refreshToken\n      }\n      success\n      code\n      message\n    }\n  }\n": types.ForgotPasswordConfirmDocument,
    "\n  mutation delete_refresh_tokens($where: refresh_tokens_bool_exp!) {\n    delete_refresh_tokens(where: $where) {\n      returning {\n        id\n        client\n      }\n      affected_rows\n    }\n  }\n": types.Delete_Refresh_TokensDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query currentUser {\n    users {\n      id\n      email\n      first_name\n      last_name\n      avatar\n    }\n  }\n"): (typeof documents)["\n  query currentUser {\n    users {\n      id\n      email\n      first_name\n      last_name\n      avatar\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query membershipTypeByEmail($email: String!) {\n    membershipTypeByEmail(email: $email) {\n      message\n      data\n    }\n  }\n"): (typeof documents)["\n  query membershipTypeByEmail($email: String!) {\n    membershipTypeByEmail(email: $email) {\n      message\n      data\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      code\n      data {\n        accessToken\n        refreshToken\n      }\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      code\n      data {\n        accessToken\n        refreshToken\n      }\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation loginWithMagicLink($email: String!) {\n    loginWithMagicLink(email: $email) {\n      code\n      data\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation loginWithMagicLink($email: String!) {\n    loginWithMagicLink(email: $email) {\n      code\n      data\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation register($input: RegisterInput!) {\n    register(input: $input) {\n      data {\n        user {\n          id\n          email\n        }\n        tokens {\n          accessToken\n          refreshToken\n        }\n      }\n      success\n      message\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation register($input: RegisterInput!) {\n    register(input: $input) {\n      data {\n        user {\n          id\n          email\n        }\n        tokens {\n          accessToken\n          refreshToken\n        }\n      }\n      success\n      message\n      errors\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation sendEmailOtp($email: String!) {\n    sendEmailOtp(email: $email) {\n      code\n      data\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation sendEmailOtp($email: String!) {\n    sendEmailOtp(email: $email) {\n      code\n      data\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation verifyOtp($input: OtpInput!) {\n    verifyOtp(input: $input) {\n      code\n      message\n      data\n    }\n  }\n"): (typeof documents)["\n  mutation verifyOtp($input: OtpInput!) {\n    verifyOtp(input: $input) {\n      code\n      message\n      data\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation refreshToken($refreshToken: UUID!) {\n    refreshToken(refreshToken: $refreshToken) {\n      code\n      data\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation refreshToken($refreshToken: UUID!) {\n    refreshToken(refreshToken: $refreshToken) {\n      code\n      data\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation forgotPassword($identity: String!) {\n    forgotPassword(identity: $identity) {\n      code\n      data\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation forgotPassword($identity: String!) {\n    forgotPassword(identity: $identity) {\n      code\n      data\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation forgotPasswordConfirm($input: ForgotPasswordConfirmInput!) {\n    forgotPasswordConfirm(input: $input) {\n      data {\n        accessToken\n        refreshToken\n      }\n      success\n      code\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation forgotPasswordConfirm($input: ForgotPasswordConfirmInput!) {\n    forgotPasswordConfirm(input: $input) {\n      data {\n        accessToken\n        refreshToken\n      }\n      success\n      code\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation delete_refresh_tokens($where: refresh_tokens_bool_exp!) {\n    delete_refresh_tokens(where: $where) {\n      returning {\n        id\n        client\n      }\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation delete_refresh_tokens($where: refresh_tokens_bool_exp!) {\n    delete_refresh_tokens(where: $where) {\n      returning {\n        id\n        client\n      }\n      affected_rows\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;