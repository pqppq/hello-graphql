import type { V2_MetaFunction } from "@remix-run/node";
import { UserList } from "../components"

export const meta: V2_MetaFunction = () => {
	return [{ title: "New Remix App" }];
};

export default function Index() {
	return <UserList />
}
