const express = require("express");
const { requireUser } = require("../middleware/auth");
const router = express.Router();

router.get("/", requireUser, (req, res) => {
	res.json({ message: "Hello from the server side!" });
});

module.exports = router;
