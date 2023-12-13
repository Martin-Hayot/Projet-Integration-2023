const router = require("express").Router();
const { Ticket, Category } = require("../models");
const { requireUser, requireAdmin } = require("../middleware");

/**
 * @openapi
 * /ticket:
 *   post:
 *     tags:
 *     - ticket
 *     summary: Creates a new ticket
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket created successfully"
 *                 ticket:
 *                   type: object
 *       '400':
 *         description: Bad Request - Message is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: Unauthorized - You have reached the maximum number of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Not Found - Category
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
router.post("/", requireUser, async (req, res) => {
    try {
        if (!req.body.message)
            return res.status(400).json({
                message: "Bad Request - Message is required",
            });

        if (req.body.categoryId) {
            const searchedCategory = await Category.findOne({
                _id: req.body.categoryId,
            });
            if (!searchedCategory) {
                return res.status(404).json({
                    message: "Not Found - Category",
                });
            }
        }
        const ticketsCreatedByUser = await Ticket.find({
            userId: req.user.userId,
            archived: false,
        });
        if (ticketsCreatedByUser.length < 5) {
            let ticket = new Ticket({
                message: req.body.message,
                userId: req.user.userId,
                ...(req.body.categoryId
                    ? { categoryId: req.body.categoryId }
                    : null),
            });
            const newTicket = await Ticket.create(ticket);
            return res.status(201).json({
                message: "Ticket created successfully",
                ticket: newTicket,
            });
        } else {
            return res.status(401).json({
                message:
                    "Unauthorized - You have reached the maximum number of tickets",
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /ticket/archive/{id}:
 *   post:
 *     tags:
 *     - ticket
 *     summary: Archives a ticket by ID
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
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket updated successfully"
 *                 ticket:
 *                   type: object
 *       '404':
 *         description: Not Found - Ticket ID
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
router.post("/archive/:id/", requireAdmin, async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            {
                archived: true,
            },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: "Not Found - Ticket ID" });
        }
        res.status(200).json({
            message: "Ticket updated successfully",
            ticket: updatedTicket,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /ticket:
 *   get:
 *     tags:
 *     - ticket
 *     summary: Fetches all non-archived tickets
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Tickets sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tickets sent successfully"
 *                 tickets:
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
router.get("/", requireAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find({
            archived: false,
        });

        res.status(200).json({
            message: "Tickets sent successfully",
            tickets: tickets,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /ticket/archived/:
 *   get:
 *     tags:
 *     - ticket
 *     summary: Fetches all archived tickets
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Tickets sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tickets sent successfully"
 *                 tickets:
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
router.get("/archived/", requireAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find({
            archived: true,
        });

        res.status(200).json({
            message: "Tickets sent successfully",
            tickets: tickets,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /ticket/user/:
 *   get:
 *     tags:
 *     - ticket
 *     summary: Fetches all non-archived tickets for the authenticated user
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Tickets sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tickets sent successfully"
 *                 tickets:
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
router.get("/user/", requireUser, async (req, res) => {
    try {
        const userTickets = await Ticket.find({
            userId: req.user.userId,
            archived: false,
        });

        res.status(200).json({
            message: "Tickets sent successfully",
            tickets: userTickets,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /ticket/{id}:
 *   get:
 *     tags:
 *     - ticket
 *     summary: Fetches a ticket by ID
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
 *         description: Ticket sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket sent successfully"
 *                 ticket:
 *                   type: object
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
router.get("/:id", requireAdmin, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        res.status(200).json({
            message: "Ticket sent successfully",
            ticket: ticket,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /ticket/{id}:
 *   delete:
 *     tags:
 *     - ticket
 *     summary: Deletes a ticket by ID
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
 *         description: Ticket deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket deleted successfully"
 *                 ticket:
 *                   type: object
 *       '404':
 *         description: Not Found - Ticket ID
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
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            return res.status(404).json({ message: "Not Found - Ticket ID" });
        }
        res.status(200).json({
            message: "Ticket deleted successfully",
            ticket: deletedTicket,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

module.exports = router;
