import type { V2_MetaFunction } from "@remix-run/node";
import { useQuery, gql } from '@apollo/client';
import { graphql } from "../graphql"

export const meta: V2_MetaFunction = () => {
	return [{ title: "New Remix App" }];
};

const query = graphql(`
 query count {
	totalUsers
	totalPhotos
}
`)

export default function Index() {
	const { loading, error, data } = useQuery(query)

	if (loading) return <p >Loading...</p>
	if (error) return <p >Error: {error.message}</p>

	return (
		<div>{JSON.stringify(data)}</div>
	);
}
