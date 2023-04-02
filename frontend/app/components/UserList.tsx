import { useAllUsersQuery } from "../graphql/apollo"
import { AddFakeUser } from "./AddFakeUser"
import { UserListItem } from "./UserListItem"
import { graphql } from "../graphql/gql"

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

export const UserList = () => {
	const { loading, error, data, refetch } = useAllUsersQuery()

	if (loading) return <p >Loading...</p>
	if (error) return <p >Error: {error.message}</p>
	if (!data) return <p >No Users</p>

	const { totalUsers, allUsers } = data

	return (
		<div >
			<p >{totalUsers} users</p>
			<button onClick={() => refetch()} >refetch</button>
			<ul >
				{allUsers.map(({ githubLogin, name, avator }) => (
					<UserListItem
						key={githubLogin}
						name={name}
						avator={avator}
					/>
				))}
			</ul>
			<AddFakeUser />
		</div>
	)
}
