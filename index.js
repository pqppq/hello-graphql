import { ApolloServer } from "apollo-server"
import {data} from "./data.js"

const {users, photos, tags} = data

// type defenition
const typeDefs = `
type User {
	githubLogin: ID!
	name: String
	avator: String
	postedPhotos: [Photo!]!
	inPhotos: [Photo!]!
}

enum PhotoCategory {
	SELFIE
	PORTRAIT
	ACTION
	LANDSCAPE
	GRAPHIC
}

type Photo {
	id: ID!
	url: String!
	name: String!
	description: String
	category: PhotoCategory!
	postedBy: User!
	taggedUsers: [User!]!
}

input PostPhotoInput {
	name: String!
	category: PhotoCategory=PORTRAIT
	description: String
}

type Query {
	totalPhotos: Int!
	allPhotos: [Photo!]!
}

type Mutation {
	postPhoto(input: PostPhotoInput): Photo!
}
`

const closure = () => {
	let id = 0
	return () => {
		return id++
	}
}
const getId = closure()

// query resolvers
const resolvers = {
	Query: {
		totalPhotos: () => photos.length,
		allPhotos: () => photos,
	},
	Mutation: {
		postPhoto(parent, args) {
			const newPhoto = { id: getId(), ...args.input }
			photos.push(newPhoto)

			return newPhoto
		}
	},
	// trivial resolver
	Photo: {
		url: parent => `http://example.com/img/${parent.id}.jpeg`,
		name: () => "💩",
		postedBy: parent => {
			return users.find(u => u.githubLogin === parent.githubUser)
		},
		taggedUsers: parent => tags.filter(t => t.photoId === parent.id)
		.map(t => users.find(u => u.githubLogin === t.userId))
	},
	User: {
		postedPhotos: parent => {
			return photos.filter(p => p.githubUser === parent.githubLogin)
		},
		inPhotos: parent => tags.filter(t => t.userId === parent.id)
		.map(t => photos.filter(p => p.id === t.photoId))
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

// start server
server.listen().then(
	({ url }) => console.log(`GraphQL service runnion on ${url} 🍺`)
)
