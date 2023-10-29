const router = require("express").Router();
const bcrypt = require("bcrypt");
const { getGoogleOAuthTokens, getGoogleUser } = require("../utils/oauth.utils");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../utils/jwt.utils");
const User = require("../models/user");

router.post("/signup", async (req, res) => {
	let user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
	});
	if (!user.email || !user.password)
		return res.status(400).json({ message: "All entries are required" });
	try {
		const searchedUser = await User.exists({ email: user.email });
		if (searchedUser !== null) {
			return res.status(409).json({ message: "User already exists" });
		}
		user.password = await bcrypt.hash(user.password, 10);
		await User.create(user);
		res.status(201).json({
			message: "User created successfully",
		});
	} catch (e) {
		console.log(e);
		res.status(500).json(e);
	}
});

router.post("/login", async (req, res) => {
	let user = new User({
		email: req.body.email,
		password: req.body.password,
	});

	if (!user.email || !user.password)
		return res.status(400).json({ message: "Email and password are required" });

	try {
		const searchedUser = await User.exists({ email: user.email }).select(
			"password"
		);
		if (searchedUser == null) {
			return res.status(401).json({ message: "User not found" });
		}
		if (await bcrypt.compare(user.password, searchedUser.password)) {
			const accessToken = generateAccessToken({
				userId: searchedUser._id,
				email: user.email,
			});
			const refresh_token = generateRefreshToken({
				userId: searchedUser._id,
				email: user.email,
			});
			res.cookie("accessToken", accessToken, {
				httpOnly: true,
				maxAge: 3.154e10,
			});
			res.cookie("refreshToken", refresh_token, {
				httpOnly: true,
				maxAge: 3.154e10,
			});
			res.status(200).json({ message: "Logged in successfully" });
		} else {
			res.status(401).json({ message: "Invalid credentials" });
		}
	} catch (e) {
		console.log(e);
		res.status(500).json(e);
	}
});

router.get("/google", async (req, res) => {
	const google_id = process.env.GOOGLE_CLIENT_ID;
	const redirect_uri = process.env.GOOGLE_OAUTH_REDIRECT_URL;
	const root_url = "https://accounts.google.com/o/oauth2/v2/auth";
	const options = {
		redirect_uri: redirect_uri,
		client_id: google_id,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		].join(" "),
	};
	const qs = new URLSearchParams(options).toString();
	console.log(`${root_url}?${qs}`);
	res.status(200).json({
		url: `${root_url}?${qs}`,
	});
});

router.get("/google/callback", async (req, res) => {
	const code = req.query.code;
	try {
		const { id_token, access_token, refresh_token } =
			await getGoogleOAuthTokens(code);
		const googleUser = await getGoogleUser(id_token);
		if (googleUser.msg == "Failed to get Google user") {
			return res.status(403).redirect("http://localhost:5173/login");
		}
		if (!googleUser.email_verified) {
			res.status(403).redirect("http://localhost:5173/login");
		}
		const password = await bcrypt.hash(googleUser.sub, 10);
		const searchedUser = await User.exists({
			email: googleUser.email,
			authType: "google",
		});
		if (searchedUser !== null) {
			return res.status(409).redirect("http://localhost:5173/login");
		}
		await User.findOneAndUpdate(
			{
				email: googleUser.email,
			},
			{
				firstname: googleUser.given_name,
				lastname: googleUser.family_name,
				password: password,
				accessToken: access_token,
			},
			{
				upsert: true,
				new: true,
			}
		);
		res
			.cookie("accessToken", access_token, {
				httpOnly: true,
				maxAge: 900000,
			})
			.cookie("refreshToken", refresh_token, {
				httpOnly: true,
				maxAge: 900000,
			})
			.redirect("http://localhost:5173/user/home");
	} catch (e) {
		console.log(e, "Failed to login with Google");
		res.redirect("http://localhost:5173/login");
	}
});

module.exports = router;
