const jwt = require("jsonwebtoken");
const { verifyRefreshToken, verifyAccessToken } = require("../utils/jwt.utils");

function requireUser(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			msg: "Unauthorized",
			authenticated: false,
		});
	}
	next();
}

function deserializeUser(req, res, next) {
	const { accessToken, refreshToken } = req.cookies;

	if (!accessToken) {
		return next();
	}
	const { payload, expired } = verifyAccessToken(accessToken);
	if (payload) {
		req.user = payload;
		return next();
	}

	const { payload: refresh } =
		expired && refreshToken
			? verifyRefreshToken(refreshToken)
			: { payload: null };

	if (!refresh) {
		return next();
	}
	const newAccessToken = jwt.sign(
		{ userId: refresh.userId, email: refresh.email },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "5m",
		}
	);
	res.cookie("accessToken", newAccessToken, {
		maxAge: 3.154e10,
		httpOnly: true,
	});
	req.user = verifyAccessToken(newAccessToken).payload;
	return next();
}

module.exports = { requireUser, deserializeUser };
