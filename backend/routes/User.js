const express = require("express");
const { requireUser } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/profile", requireUser, async (req, res) => {
    try {
        const searchedUser = await User.findOne({
            email: req.user.email,
        }).select("firstname lastname email");
        if (!searchedUser) {
            return res.status(404).json({
                message: "User not found!",
            });
        }
        res.status(200).json(searchedUser);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong! " + error.message,
        });
    }
});

router.get("/profile/picture", requireUser, async (req, res) => {
    const { userId } = req.user;
    const getProfilePicture = await User.findById(userId).select(
        "profilePicture"
    );
    res.status(200).json({ profilePicture: getProfilePicture.profilePicture });
});

router.patch("/profile", requireUser, async (req, res) => {
    const { userId } = req.user;
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
            message: "All entries are required!",
        });
    }
    try {
        const getUserPassword = await User.findById(userId).select("password");
        if (await bcrypt.compare(password, getUserPassword.password)) {
            return res.status(400).json({
                message: "New password cannot be the same as old password!",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updateUser = await User.findByIdAndUpdate(userId, {
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        if (!updateUser) {
            return res.status(404).json({
                message: "User not found!",
            });
        }
        res.status(200).json({
            message: "User updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong! " + error.message,
        });
    }
});

router.put("/profile/picture", requireUser, async (req, res) => {
    const { userId } = req.user;
    const { profilePicture } = req.body;
    if (!profilePicture) {
        return res.status(400).json({
            message: "Profile picture is required!",
        });
    }
    try {
        const updateProfilePicture = await User.findByIdAndUpdate(userId, {
            profilePicture,
        });
        if (!updateProfilePicture) {
            return res.status(404).json({
                message: "User not found!",
            });
        }
        res.status(200).json({
            message: "Profile picture updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong! " + error.message,
        });
    }
});

module.exports = router;
