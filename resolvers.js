import { authorizeWithGithub } from "./auth.js"
import { data } from "./data.js"
import { GraphQLScalarType } from "graphql"
import * as dotenv from "dotenv"

dotenv.config()
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

const { users, photos, tags } = data

const closure = () => {
	let id = 0
	return () => {
		return id++
	}
}
const getId = closure()

const githubAuth = async (parent, { code }, { db }) => {
	// 1. get data from github
	const { message, access_token, avatar_url, login, name } = await authorizeWithGithub({
		client_id: GITHUB_CLIENT_ID,
		client_secret: GITHUB_CLIENT_SECRET,
		code
	})

	// 2. if message exists, some error has happened
	if (message) {
		throw new Error(message)
	}

	const userInfo = { name, githubLogin: login, githubToken: access_token, avator: avatar_url }

	// 3. update records
	await db.collection("users").replaceOne({ githublogin: login }, userInfo, { upsert: true })

	return { user: userInfo, token: access_token }
}

// query resolvers
export const resolvers = {
	Query: {
		totalPhotos: (parent, args, { db }) => db.collection("photos").estimateDocumentCount(),
		allPhotos: (parent, args, { db }) => db.collection("photos").find().toArray(),
		totalUsers: (parent, args, { db }) => db.collection("users").estimateDocumentCount(),
		allUsers: (parent, args, { db }) => db.collection("users").find().toArray(),
	},
	Mutation: {
		postPhoto: (parent, args) => {
			const newPhoto = { id: getId(), ...args.input, created: new Date() }
			photos.push(newPhoto)

			return newPhoto
		},
		githubAuth,
	},
	// trivial resolver
	Photo: {
		url: parent => `http://example.com/img/${parent.id}.jpeg`,
		postedBy: parent => {
			return users.find(u => u.githubLogin === parent.githubUser)
		},
		taggedUsers: parent => tags.filter(t => t.photoId === parent.id)
			.map(t => users.find(u => u.githubLogin === t.userId)),
	},
	User: {
		postedPhotos: parent => {
			return photos.filter(p => p.githubUser === parent.githubLogin)
		},
		inPhotos: parent => tags.filter(t => t.userId === parent.id)
			.map(t => photos.filter(p => p.id === t.photoId))
	},
	DateTime: new GraphQLScalarType({
		name: "DateTime",
		description: "A valid date time value.",
		// parse value befor pass it to resolver function
		// ex. allPhotos(after: $after)
		parseValue: value => new Date(value),
		// parse value from query document before pass it to resolver function
		// ex. allPhotos(after: `4/1/2022`)
		parseLiteral: ast => ast.value,
		serialize: value => new Date(value).toISOString(),
	})
}
