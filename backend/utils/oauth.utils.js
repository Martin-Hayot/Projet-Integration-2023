const axios = require("axios");

async function getGoogleOAuthTokens(code) {
	const url = "https://oauth2.googleapis.com/token";
	const values = {
		code: code,
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
		grant_type: "authorization_code",
	};
	try {
		const qs = new URLSearchParams(values).toString();
		const res = await axios.post(url, values, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		return res.data;
	} catch (e) {
		console.log(e, "Failed to get Google OAuth tokens");
		throw new Error(e.message);
	}
}

async function getGoogleUser(id_token) {
	try {
		const res = await axios.get(
			`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
		);
		return res.data;
	} catch (e) {
		console.log(e, "Failed to get Google user");
		return { message: "Failed to get Google user" };
	}
}

module.exports = {
	getGoogleOAuthTokens,
	getGoogleUser,
};
