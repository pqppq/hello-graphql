import { graphql } from "../graphql/gql"
import { useAddFakeUsersMutation } from "../graphql/apollo"

const ADD_FAKE_USERS_MUTATION = graphql(`
	mutation addFakeUsers($count:Int!) {
		addFakeUsers(count:$count) {
			githubLogin
			name
			avator
		}
	}
`)

export const AddFakeUser = () => {
	const [addFakeUser, {loading, error, data}] = useAddFakeUsersMutation()
	return <button onClick={() => addFakeUser({variables: {count: 1}})}>Add fake user</button>
}
