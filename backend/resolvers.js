import { authorizeWithGithub } from "./auth.js"
import { data } from "./data.js"
import { GraphQLScalarType } from "graphql"
import * as dotenv from "dotenv"

dotenv.config()
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

const { users, photos, tags } = data

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

	return {
		token: access_token,
		user: userInfo,
	}
}

const fakeUserAuth = async (parent, { githubLogin }, { db }) => {
	const user = await db.collection("users").findOne({ githubLogin })
	if (!user) {
		throw new Error(`Cannot find user with githubLogin ${githubLogin}`)
	}

	return {
		token: user.githubToken,
		user
	}
}

// query resolvers
export const resolvers = {
	Query: {
		me: (parent, args, { currentUser }) => currentUser,
		totalPhotos: async (parent, args, { db }) => await db.collection("photos").count(),
		allPhotos: async (parent, args, { db }) => await db.collection("photos").find().toArray(),
		totalUsers: async (parent, args, { db }) => await db.collection("users").count(),
		allUsers: async (parent, args, { db }) => await db.collection("users").find().toArray(),
	},
	Mutation: {
		postPhoto: async (parent, args, { db, currentUser }) => {
			if (!currentUser) {
				throw new Error("only an authorized user can post a photo")
			}
			const newPhoto = {
				...args.input,
				userID: currentUser.githubLogin,
				created: new Date()
			}

			const { _id } = await db.collection("photos").insertOne(newPhoto)
			newPhoto.id = _id

			return newPhoto
		},
		githubAuth,
		fakeUserAuth,
		addFakeUsers: async (parent, { count }, { db }) => {
			const res = await fetch(`https://randomuser.me/api/?results=${count}`)

			const { results } = await res.json()
			const users = results.map(d => ({
				githubLogin: d.login.username,
				name: `${d.name.first} ${d.name.last}`,
				avator: d.picture.thumbnail,
				githubToken: d.login.sha1
			}))
			await db.collection("users").insertMany(users)

			return users
		}
	},
	// trivial resolver
	Photo: {
		id: parent => parent.id || parent._id,
		url: parent => `/img/photos/${parent.id}.jpeg`,
		postedBy: async (parent, args, { db }) => {
			return await db.collection("users").findOne({ githubLogin: parent.userID })
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
