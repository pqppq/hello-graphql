import type { User } from "../graphql/graphql"

export const UserListItem = ({ name, avator }: User) => {
	return (
		<li>
			<img src={avator || ""} width={48} height={48} alt="avator" />
			<p >{name}</p>
		</li>
	)
}
