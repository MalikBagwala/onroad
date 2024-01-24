import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    'http://hasura:8080/v1/graphql': {
      headers: {
        'x-hasura-admin-secret': 'onroad',
      },
    },
  },
  documents: 'src/graphql/**/*.{ts,tsx}',
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
