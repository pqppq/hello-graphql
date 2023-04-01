import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql",
	cache: new InMemoryCache()
})

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<ApolloProvider client={client}>
					<Outlet />
					<ScrollRestoration />
					<Scripts />
					<LiveReload />
				</ApolloProvider>
			</body>
		</html >
	);
}
