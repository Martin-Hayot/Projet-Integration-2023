const router = require("express").Router();
const bcrypt = require("bcrypt");
const { getGoogleOAuthTokens, getGoogleUser } = require("../utils/oauth.utils");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/jwt.utils");
const User = require("../models/user");
const { requireUser } = require("../middleware/auth");

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags:
 *      - auth
 *     summary: Create a new user
 *     parameters:
 *      - in: query
 *        name: firstname
 *        schema:
 *          type: string
 *          default: john
 *      - in: query
 *        name: lastname
 *        schema:
 *          type: string
 *          default: doe
 *      - in: query
 *        name: email
 *        schema:
 *          type: string
 *          default: johndoe@example.com
 *      - in: query
 *        name: password
 *        schema:
 *          type: string
 *          default: password
 *      - in: query
 *        name: ability
 *        schema:
 *          type: number
 *          default: 0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 default: john
 *               lastname:
 *                 type: string
 *                 default: doe
 *               email:
 *                 type: string
 *                 default: johndoe@example.com
 *               password:
 *                 type: string
 *                 default: password
 *               ability:
 *                 type: number
 *                 default: 0
 *             required:
 *               - email
 *               - password
 *               - firstname
 *               - lastname
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: All entries are required
 *       '409':
 *         description: User already exists
 *       '500':
 *         description: Internal server error
 */
router.post("/signup", async (req, res) => {
    let user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        ability: req.body.ability ? req.body.ability : null,
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

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *     - auth
 *     summary: Login a user
 *     parameters:
 *     - in: body
 *       name: user
 *       description: The user to create.
 *       schema:
 *         type: object
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             default: johndoe@example.com
 *           password:
 *             type: string
 *             default: password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: johndoe@example.com
 *               password:
 *                 type: string
 *                 default: password
 *     responses:
 *       '200':
 *         description: Logged in successfully
 *       '400':
 *         description: Email and password are required
 *       '401':
 *         description: Invalid credentials
 *       '500':
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    if (!user.email || !user.password)
        return res
            .status(400)
            .json({ message: "Email and password are required" });

	try {
		const searchedUser = await User.exists({ email: user.email }).select(
			'password ability'
		);
		if (searchedUser == null) {
			return res.status(401).json({ message: 'User not found' });
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
			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				maxAge: 3.154e10,
			});
			res.cookie('refreshToken', refresh_token, {
				httpOnly: true,
				maxAge: 3.154e10,
			});
			res.status(200).json({
				message: 'Logged in successfully',
				ability: searchedUser.ability || 0,
				userId: searchedUser._id,
			});
		} else {
			res.status(401).json({ message: 'Invalid credentials' });
		}
	} catch (e) {
		console.log(e);
		res.status(500).json(e);
	}
});

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     tags:
 *     - auth
 *     summary: Redirects to Google's OAuth 2.0 endpoint
 *     responses:
 *       '200':
 *         description: Returns the Google OAuth 2.0 endpoint URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The Google OAuth 2.0 endpoint URL
 */
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

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     tags:
 *     - auth
 *     summary: Handles the callback from Google's OAuth 2.0 endpoint
 *     parameters:
 *     - in: query
 *       name: code
 *       schema:
 *         type: string
 *       required: true
 *       description: The authorization code returned from Google's OAuth 2.0 endpoint
 *     responses:
 *       '200':
 *         description: User logged in successfully and redirected to home page
 *       '403':
 *         description: Failed to get Google user or email not verified, redirected to login page
 *       '409':
 *         description: User already exists, redirected to login page
 */
router.get("/google/callback", async (req, res) => {
    const code = req.query.code;
    try {
        const { id_token } = await getGoogleOAuthTokens(code);
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
        const user = await User.findOneAndUpdate(
            {
                email: googleUser.email,
            },
            {
                firstname: googleUser.given_name,
                lastname: googleUser.family_name,
                password: password,
            },
            {
                upsert: true,
                new: true,
            }
        );
        const accessToken = generateAccessToken({
            userId: user._id,
            email: user.email,
        });
        const refreshToken = generateRefreshToken({
            userId: user._id,
            email: user.email,
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 3.154e10,
        })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 3.154e10,
            })
            .redirect("http://localhost:5173/user/home");
    } catch (e) {
        console.log(e, "Failed to login with Google");
        res.redirect("http://localhost:5173/login");
    }
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *     - auth
 *     summary: Returns the authenticated user's information
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authenticated"
 *                 authenticated:
 *                   type: boolean
 *                   example: true
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 authenticated:
 *                   type: boolean
 *                   example: false
 */
router.get("/me", requireUser, async (req, res) => {
    const searchedUser = await User.findById(req.user.userId);
    if (searchedUser == null) {
        return res
            .status(404)
            .json({ message: "User not found", authenticated: false });
    }
    res.status(200).json({
        message: "Authenticated",
        authenticated: true,
    });
});

/**
 * @openapi
 * /api/auth/logout:
 *   delete:
 *     tags:
 *     - auth
 *     summary: Logout a user
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *       '401':
 *         description: Unauthorized
 */
router.delete("/logout", requireUser, async (req, res) => {
    res.clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200)
        .json({
            message: "Logged out successfully",
        });
});

module.exports = router;
