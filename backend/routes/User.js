const express = require("express");
const { requireUser } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

/**
 * @openapi
 * /user/profile:
 *   get:
 *     tags:
 *     - user
 *     summary: Fetches the profile of the authenticated user
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns the user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 *       '500':
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

/**
 * @openapi
 * /user/profile/picture:
 *   get:
 *     tags:
 *     - user
 *     summary: Fetches the profile picture of the authenticated user
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns the user's profile picture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profilePicture:
 *                   type: string
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 *       '500':
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/profile/picture", requireUser, async (req, res) => {
    const { userId } = req.user;
    const getProfilePicture = await User.findById(userId).select(
        "profilePicture"
    );
    res.status(200).json({ profilePicture: getProfilePicture.profilePicture });
});

/**
 * @openapi
 * /user/profile:
 *   patch:
 *     tags:
 *     - user
 *     summary: Updates the profile of the authenticated user
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully!"
 *       '400':
 *         description: All entries are required or new password cannot be the same as old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 *       '500':
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

/**
 * @openapi
 * /user/profile:
 *   patch:
 *     tags:
 *     - user
 *     summary: Updates the profile of the authenticated user
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully!"
 *       '400':
 *         description: All entries are required or new password cannot be the same as old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 *       '500':
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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
