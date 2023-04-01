export const data = {
	users: [
		{"githubLogin": "mHattrup", "name": "Mike Hattrup"},
		{"githubLogin": "gPlake", "name": "Glen Plake"},
		{"githubLogin": "sSchmidt", "name": "Scot Schmidt"},
	],
	photos: [
		{"id": 1, "name": "Droppping the Heart Chute", description: "The heart chute is one of my favorite chutes", "category": "ACTION", "githubUser": "gPlake", "created": "3-28-1977"},
		{"id": 2, "name": "Enjoying the sunshine", "category": "SELFIE", "githubUser": "sSchmidt", "created": "1-2-1985"},
		{"id": 3, "name": "Gunbarrel 25", description: "24 laps on gunbarrel today", "category": "LANDSCAPE", "githubUser": "sSchmidt", "created": "2018-04-15T19:09:57.308Z"},
	],
	tags: [
		{"photoId": 1, "userId": "gPlake"},
		{"photoId": 2, "userId": "sSchmidt"},
		{"photoId": 2, "userId": "mHattrup"},
		{"photoId": 2, "userId": "gPlake"},
	]
}
