import type { V2_MetaFunction } from "@remix-run/node";
import { graphql } from "../graphql/gql"
import { useAllUsersQuery } from "../graphql/apollo"
import { UserList } from "../components"

export const meta: V2_MetaFunction = () => {
	return [{ title: "New Remix App" }];
};

const ROOT_QUERY = graphql(`
 query allUsers {
	totalUsers
	allUsers {
		githubLogin
		name
		avator
	}
}
`)

export default function Index() {
	// const {loading, error, data} = useAllUsersQuery()
	const { loading, error, data, refetch } = useAllUsersQuery()

	if (loading) return <p >Loading...</p>
	if (error) return <p >Error: {error.message}</p>
	if (!data) return <p >No Users</p>

	const { totalUsers, allUsers } = data

	return <UserList count={totalUsers} users={allUsers} />
}
