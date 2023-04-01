
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../typeDefs.graphql",
  documents: "app/**/*.tsx",
  generates: {
    "app/graphql/": {
      preset: "client",
      plugins: ["typescript"]
    }
  }
};

export default config;
