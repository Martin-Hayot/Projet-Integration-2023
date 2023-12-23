const jwt = require("jsonwebtoken");

function generateAccessToken(payload) {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "5m",
	});
}

function generateRefreshToken(payload) {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "30d",
	});
}

function verifyAccessToken(accessToken) {
	try {
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		return { payload: decoded, expired: false };
	} catch (err) {
		return { payload: null, expired: true };
	}
}

function verifyRefreshToken(refreshToken) {
	try {
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		return { payload: decoded, expired: false };
	} catch (err) {
		return { payload: null, expired: true };
	}
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
};
