import { data } from "./data.js"

const { users, photos, tags } = data

const closure = () => {
	let id = 0
	return () => {
		return id++
	}
}
const getId = closure()

// query resolvers
export const resolvers = {
	Query: {
		totalPhotos: () => photos.length,
		allPhotos: (parent, args) => photos,
	},
	Mutation: {
		postPhoto(parent, args) {
			const newPhoto = { id: getId(), ...args.input, created: new Date() }
			photos.push(newPhoto)

			return newPhoto
		}
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
