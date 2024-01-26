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
    "\n  query currentUser {\n    users {\n      id\n      email\n      username\n      first_name\n      last_name\n      avatar\n      google_id\n      refresh_tokens {\n        id\n        client\n        expires_at\n        created_at\n      }\n      city {\n        id\n        name\n        state {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.CurrentUserDocument,
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
    "\n  query cities(\n    $distinct_on: [cities_select_column!]\n    $limit: Int\n    $offset: Int\n    $order_by: [cities_order_by!]\n    $where: cities_bool_exp\n  ) {\n    cities(\n      distinct_on: $distinct_on\n      limit: $limit\n      offset: $offset\n      order_by: $order_by\n      where: $where\n    ) {\n      id\n      name\n      state {\n        id\n        name\n      }\n    }\n  }\n": types.CitiesDocument,
    "\n  mutation update_users_by_pk($_set: users_set_input, $pk_columns: users_pk_columns_input!) {\n    update_users_by_pk(_set: $_set, pk_columns: $pk_columns) {\n      id\n      email\n      username\n      first_name\n      last_name\n      avatar\n      city {\n        id\n        name\n        state {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.Update_Users_By_PkDocument,
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
export function graphql(source: "\n  query currentUser {\n    users {\n      id\n      email\n      username\n      first_name\n      last_name\n      avatar\n      google_id\n      refresh_tokens {\n        id\n        client\n        expires_at\n        created_at\n      }\n      city {\n        id\n        name\n        state {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query currentUser {\n    users {\n      id\n      email\n      username\n      first_name\n      last_name\n      avatar\n      google_id\n      refresh_tokens {\n        id\n        client\n        expires_at\n        created_at\n      }\n      city {\n        id\n        name\n        state {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query cities(\n    $distinct_on: [cities_select_column!]\n    $limit: Int\n    $offset: Int\n    $order_by: [cities_order_by!]\n    $where: cities_bool_exp\n  ) {\n    cities(\n      distinct_on: $distinct_on\n      limit: $limit\n      offset: $offset\n      order_by: $order_by\n      where: $where\n    ) {\n      id\n      name\n      state {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query cities(\n    $distinct_on: [cities_select_column!]\n    $limit: Int\n    $offset: Int\n    $order_by: [cities_order_by!]\n    $where: cities_bool_exp\n  ) {\n    cities(\n      distinct_on: $distinct_on\n      limit: $limit\n      offset: $offset\n      order_by: $order_by\n      where: $where\n    ) {\n      id\n      name\n      state {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation update_users_by_pk($_set: users_set_input, $pk_columns: users_pk_columns_input!) {\n    update_users_by_pk(_set: $_set, pk_columns: $pk_columns) {\n      id\n      email\n      username\n      first_name\n      last_name\n      avatar\n      city {\n        id\n        name\n        state {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation update_users_by_pk($_set: users_set_input, $pk_columns: users_pk_columns_input!) {\n    update_users_by_pk(_set: $_set, pk_columns: $pk_columns) {\n      id\n      email\n      username\n      first_name\n      last_name\n      avatar\n      city {\n        id\n        name\n        state {\n          id\n          name\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;