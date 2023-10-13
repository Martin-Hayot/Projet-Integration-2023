const router = require("express").Router();
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/auth");
const generateAccessToken = require("../utils/auth");
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

router.get("/authenticate", authenticateToken, (req, res) => {
	res.json({ authenticated: true });
});

module.exports = router;
