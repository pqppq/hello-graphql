import { ApolloServer } from "apollo-server-express"
import expressPlayground from "graphql-playground-middleware-express"
import express from "express"
import { readFileSync } from "fs"
import { resolvers } from "./resolvers.js"
import { MongoClient } from "mongodb"
import * as dotenv from "dotenv"

dotenv.config()
const typeDefs = readFileSync("../typeDefs.graphql", "UTF-8")

const start = async () => {
	const app = express()
	app.get("/", (req, res) => res.end("Welcom to the PhotoShare API"))
	app.get("/playground", expressPlayground.default({ endpoint: "/graphql" }))

	const MONGO_DB_URI = process.env.DB_URI
	const client = await MongoClient.connect(MONGO_DB_URI)
	const db = client.db()

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			const githubToken = req.headers.authorization
			const currentUser = await db.collection("users").findOne({ githubToken })

			return { db, currentUser }
		},
	})
	await server.start()
	server.applyMiddleware({ app })

	// start server
	app.listen({ port: 4000 }, () => {
		console.log(`GraphQL service running @ localhost:4000${server.graphqlPath}`)
	})

	return server
}

await start()
