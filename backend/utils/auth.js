const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "30min",
	});
}

module.exports = generateAccessToken;
