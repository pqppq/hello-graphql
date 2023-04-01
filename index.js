import { ApolloServer } from "apollo-server-express"
import expressPlayground from "graphql-playground-middleware-express"
import express from "express"
import { readFileSync } from "fs"
import { resolvers } from "./resolvers.js"

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8")

const app = express()
app.get("/", (req, res) => res.end("Welcom to the PhotoShare API"))
app.get("/playground", expressPlayground.default({ endpoint: "/grpahql" }))

const start = async (app) => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	await server.start()
	server.applyMiddleware({ app })

	return server
}

const server = await start(app)

// start server
app.listen({ port: 4000 }, () => {
	console.log(`GraphQL service runnion @ localhost:4000${server.graphqlPath}`)
})
