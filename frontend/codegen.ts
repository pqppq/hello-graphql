
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	generates: {
		"app/graphql/": {
			schema: "../typeDefs.graphql",
			documents: "app/**/*.tsx",
			preset: "client"
		},
		"app/graphql/apollo.ts": {
			schema: "../typeDefs.graphql",
			documents: "app/**/*.tsx",
			plugins: ["typescript", "typescript-operations", "typescript-apollo-client-helpers", "typescript-react-apollo"],
		},
	}
};

export default config;
