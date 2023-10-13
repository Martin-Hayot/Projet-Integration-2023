const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth");
const {
	getGoogleOAuthTokens,
	getGoogleUser,
	generateAccessToken,
} = require("../utils/auth");
const User = require("../models/user");

router.post("/signup", async (req, res) => {
	let user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
	});
	try {
		const searchedUser = await User.exists({ email: user.email });
		if (searchedUser !== null) {
			return res.status(409).json({ errors: { msg: "User already exists" } });
		}
		hash = await bcrypt.hash(user.password, 10);
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
	try {
		const searchedUser = await User.exists({ email: user.email }).select(
			"password"
		);
		if (searchedUser == null) {
			return res.json({ errors: { msg: "User not found" } });
		}
		if (await bcrypt.compare(user.password, searchedUser.password)) {
			const accessToken = generateAccessToken({ email: user.email });
			await User.findOneAndUpdate(
				{ email: user.email },
				{ accessToken: accessToken }
			);
			res.status(200).json({
				accessToken: accessToken,
			});
		} else {
			res.status(401).json({ errors: { msg: "Invalid credentials" } });
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
		const { id_token } = await getGoogleOAuthTokens(code);
		const googleUser = await getGoogleUser(id_token);
		if (!googleUser.email_verified) {
			res.status(403).json({ errors: { msg: "Email not verified" } });
		}
		const password = await bcrypt.hash(googleUser.sub, 10);
		const access_token = generateAccessToken({ email: googleUser.email });
		const user = await User.findOneAndUpdate(
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
			.redirect("http://localhost:5173/user/home");
	} catch (e) {
		console.log(e, "Failed to login with Google");
		res.redirect("http://localhost:5173/user/login");
	}
});

router.get("/authenticate", authenticateToken, (req, res) => {
	res.json({ authenticated: true });
});

module.exports = router;
