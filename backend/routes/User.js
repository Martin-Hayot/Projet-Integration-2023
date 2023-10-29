const express = require("express");
const { requireUser } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

router.get("/", requireUser, async (req, res) => {
	const searchedUser = await User.findOne({ email: req.user.email }).select(
		"password"
	);
	res.json({ message: "Hello from the server side!" });
});

module.exports = router;
