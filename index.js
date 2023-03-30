import { ApolloServer } from "apollo-server"

// type defenition
const typeDefs = `
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
const photos = []

// query resolvers
const resolvers = {
	Query: {
		totalPhotos: () => photos.length,
	},
	Mutation: {
		postPhoto(parent, args) {
			console.log("args:",args);
			const newPhoto = { id: getId(), ...args.input }
			photos.push(newPhoto)

			return newPhoto
		}
	},
	// trivial resolver
	Photo: {
		url: parent => `http://example.com/img/${parent.id}.jpeg`,
		name: () => "💩"
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
