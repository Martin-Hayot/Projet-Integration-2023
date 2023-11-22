const express = require("express");
const { requireUser } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

router.get("/", requireUser, async (req, res) => {
	const searchedUser = await User.findOne({ email: req.user.email }).select(
		"password"
	);
	res
		.status(200)
		.json({ message: "Hello from the server side!", user: searchedUser });
});

router.get("/ability", requireUser, async (req, res) => {
	const searchedUser = await User.findOne({ email: req.user.email }).select(
		"ability"
	);
	res.status(200).json({
		message: "Ability sent successfully",
		ability: searchedUser.ability,
	});
});

module.exports = router;
