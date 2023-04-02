import type { User } from "../graphql/graphql"
import {AddFakeUser} from "./AddFakeUser"
import { UserListItem } from "./UserListItem"

export const UsreList = ({ count, users }: { count: number, users: User[] }) => {
	return (
		<div >
			<p >{count} users</p>
			<ul >
				{users.map(({ githubLogin, name, avator }) => (
					<UserListItem key={githubLogin}
						name={name}
						avator={avator}
					/>
				))}
			</ul>
			<AddFakeUser />
		</div>
	)
}
