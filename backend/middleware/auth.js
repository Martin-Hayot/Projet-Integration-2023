const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { verifyRefreshToken, verifyAccessToken } = require("../utils/jwt.utils");

function requireUser(req, res, next) {
	/**
	 * @description Check if the user object is set in the request and return an error if not
	 * @param {express.Request} req
	 * @param {express.Response} res
	 * @param {express.NextFunction} next
	 */
	if (!req.user) {
		return res.status(401).json({
			message: "Unauthorized",
			authenticated: false,
		});
	}
	const { email } = req.user;
	searchedUser = User.findOne({ email: email });
	if (!searchedUser) {
		return res.status(401).json({
			message: "Unauthorized",
			authenticated: false,
		});
	}
	return next();
}

async function requireAdmin(req, res, next) {
	/**
	 * @description Check if the user object is set in the request and return an error if not
	 * @param {express.Request} req
	 * @param {express.Response} res
	 * @param {express.NextFunction} next
	 */
	if (!req.user) {
		return res.status(401).json({
			message: "Unauthorized - User not logged in",
			authenticated: false,
		});
	}
	const { email } = req.user;
	searchedUser = await User.findOne({ email: email }).select("ability");
	if (!searchedUser) {
		return res.status(404).json({
			message: "Not Found - User",
			authenticated: false,
		});
	}
	if (searchedUser.ability !== 1) {
		return res
			.status(401)
			.json({ message: "Unauthorized - Not Admin", authenticated: false });
	}
	return next();
}

async function deserializeUser(req, res, next) {
	/**
	 * @description Check if the user is authenticated and set the user object in the request
	 * @param {express.Request} req
	 * @param {express.Response} res
	 * @param {express.NextFunction} next
	 */
	const { accessToken, refreshToken } = req.cookies;

	if (!accessToken) {
		return next();
	}

	const { payload, expired } = verifyAccessToken(accessToken);

	if (payload) {
		req.user = payload;
		return next();
	}

	// access token expired

	if (!refreshToken) {
		return next();
	}

	// refresh token reuse detection in database
	const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

	if (foundUser) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err) {
					return next();
				}
				//console.log("attempt to reuse a refresh token");
				const hackedUser = await User.findById(decoded.userId);
				hackedUser.refreshToken = [];
				const result = await hackedUser.save();
				//console.log(result);
				return next();
			}
		);
		return next();
	}

	// verify refresh token
	const { payload: refresh } =
		expired && refreshToken
			? verifyRefreshToken(refreshToken)
			: { payload: null };

	if (!refresh) {
		return next();
	}
	const refreshTokenTimeLeft = refresh.exp * 1000 - Date.now();
	// refresh token valid
	// generate new access token and refresh token
	const newRefreshToken = jwt.sign(
		{
			userId: refresh.userId,
			email: refresh.email,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: Math.floor(refreshTokenTimeLeft / 1000),
		}
	);
	// store new refresh token in database
	await User.findOneAndUpdate(
		{ email: refresh.email },
		{ $push: { refreshToken: refreshToken } },
		{ upsert: true, new: true }
	);
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
	res.cookie("refreshToken", newRefreshToken, {
		maxAge: 3.154e10,
		httpOnly: true,
	});
	req.user = verifyAccessToken(newAccessToken).payload;
	return next();
}

module.exports = { requireUser, deserializeUser, requireAdmin };
