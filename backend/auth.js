export const requestGithubToken = async (credentials) => {
	const res = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(credentials)
	})

	if (!res.ok) {
		throw new Error(`${res.status}: ${res.statusText}`)
	}
	const data = await res.json()

	return data
}

export const requestGithubUserAccount = async (token) => {
	const res = await fetch(`https://api.github.com/user`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	if (!res.ok) {
		throw new Error(`${res.status}: ${res.statusText}`)
	}
	const data = await res.json()

	return data
}

export const authorizeWithGithub = async (credentials) => {
	const { access_token } = await requestGithubToken(credentials)
	const githubUser = await requestGithubUserAccount(access_token)

	return { ...githubUser, access_token }
}
