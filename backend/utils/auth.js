const jwt = require("jsonwebtoken");
const axios = require("axios");

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: 1800,
	});
}

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
		console.log(res.data);
		return res.data;
	} catch (e) {
		console.log(e, "Failed to get Google user");
	}
}

module.exports = { generateAccessToken, getGoogleOAuthTokens, getGoogleUser };
