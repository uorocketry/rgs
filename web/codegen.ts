import { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'http://0.0.0.0:4000/v1/graphql';

const config: CodegenConfig = {
	schema: GRAPHQL_ENDPOINT,
	documents: ['./src/**/*.gql'],
	generates: {
		'./src/lib/gql/': {
			preset: 'client',
			plugins: [],
			config: {
				useTypeImports: true
			},
			presetConfig: {
				gqlTagName: 'gql'
			}
		}
	},
	ignoreNoDocuments: true
};

export default config;
