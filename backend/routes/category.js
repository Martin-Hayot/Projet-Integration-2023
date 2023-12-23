const router = require("express").Router();
const { Category, Ticket } = require("../models");
const { requireAdmin, requireUser } = require("../middleware");

/**
 * @openapi
 * /category:
 *   post:
 *     tags:
 *     - category
 *     summary: Creates a new category
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *                 category:
 *                   type: object
 *       '400':
 *         description: Bad Request - Label Required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request - Label Required"
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
router.post("/", requireAdmin, async (req, res) => {
    if (!req.body.label)
        return res
            .status(400)
            .json({ message: "Bad Request - Label Required" });

    try {
        let category = new Category({
            label: req.body.label,
        });
        const newCategory = await Category.create(category);
        res.status(201).json({
            message: "Category created successfully",
            category: newCategory,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

/**
 * @openapi
 * /category:
 *   get:
 *     tags:
 *     - category
 *     summary: Fetches all categories
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Categories sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categories sent"
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
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
router.get("/", requireUser, async (req, res) => {
    try {
        const searchedCategories = await Category.find();
        res.status(200).json({
            message: "Categories sent",
            categories: searchedCategories,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /category/search/{label}:
 *   get:
 *     tags:
 *     - category
 *     summary: Searches categories by label
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - name: label
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: Categories sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categories sent"
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
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
router.get("/search/:label/", requireAdmin, async (req, res) => {
    try {
        const searchedCategories = await Category.find({
            label: { $regex: req.params.label, $options: "i" },
        });
        res.status(200).json({
            message: "Categories sent",
            categories: searchedCategories,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /category/{id}:
 *   get:
 *     tags:
 *     - category
 *     summary: Fetches a category by ID
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: Category sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category sent successfully"
 *                 category:
 *                   type: object
 *       '404':
 *         description: Not Found - Category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
router.get("/:id", requireUser, async (req, res) => {
    try {
        const searchedCategory = await Category.findById(req.params.id);
        if (!searchedCategory) {
            return res.status(404).json({ message: "Not Found - Category ID" });
        }
        res.status(200).json({
            message: "Category sent successfully",
            category: searchedCategory,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /category/{id}:
 *   delete:
 *     tags:
 *     - category
 *     summary: Deletes a category by ID
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *                 category:
 *                   type: object
 *       '404':
 *         description: Not Found - Category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Not Found - Category ID" });
        }
        await Ticket.updateMany(
            { categoryId: req.params.id },
            { $unset: { categoryId: 1 } }
        );
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Not Found - Category ID" });
        }

        res.status(200).json({
            message: "Category deleted successfully",
            category: deletedCategory,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

module.exports = router;
