const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const Aquarium = require("../models/sonde/aquarium");
const AquariumDiagnostic = require("../models/sonde/diagnostic");
const AquariumData = require("../models/sonde/data");

/**
 * @openapi
 * /api/aquarium:
 *   post:
 *     tags:
 *     - aquarium
 *     summary: Creates a new aquarium
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Aquarium created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aquarium created successfully"
 *       '400':
 *         description: All entries are required
 *       '500':
 *         description: Internal server error
 */
router.post("/", requireUser, async (req, res) => {
    const { userId } = req.user;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "All entries are required" });
    }
    const aquarium = new Aquarium({
        userId,
        name,
    });
    try {
        await aquarium.save();
        res.status(201).json({ message: "Aquarium created successfully" });
    } catch (e) {
        console.log("Error : ", e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /api/aquarium:
 *   get:
 *     tags:
 *     - aquarium
 *     summary: Fetches all aquariums for the authenticated user
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns a list of aquariums
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *       '400':
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/", requireUser, async (req, res) => {
    const { userId } = req.user;
    await Aquarium.find({ userId: userId })
        .then((aquarium) => res.status(200).json(aquarium))
        .catch((error) => res.status(400).json({ error }));
});

/**
 * @openapi
 * /api/aquarium/diagnostic:
 *   post:
 *     tags:
 *     - aquarium
 *     summary: Creates a new diagnostic for an aquarium
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aquariumId
 *               - date
 *             properties:
 *               aquariumId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       '201':
 *         description: Diagnostic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Diagnostic created successfully"
 *       '400':
 *         description: All entries are required
 *       '500':
 *         description: Internal server error
 */
router.post("/diagnostic/", requireUser, async (req, res) => {
    const { aquariumId } = req.body;
    const { date } = req.body;
    if (!aquariumId || !date) {
        return res.status(400).json({ message: "All entries are required" });
    }
    const aquariumDiagnostic = new AquariumDiagnostic({
        aquariumId,
        date,
    });

    try {
        await aquariumDiagnostic.save();
        res.status(201).json({ message: "Diagnostic created successfully" });
    } catch (e) {
        console.log("Error : ", e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /api/aquarium/{aquariumId}/diagnostic/:
 *   get:
 *     tags:
 *     - aquarium
 *     summary: Fetches all diagnostics for a specific aquarium
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: aquariumId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ID of the aquarium
 *     responses:
 *       '200':
 *         description: Returns a list of diagnostics for the aquarium
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   aquariumId:
 *                     type: string
 *       '400':
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/:aquariumId/diagnostic/", requireUser, async (req, res) => {
    const aquariumId = req.params.aquariumId;
    await AquariumDiagnostic.find({ aquariumId: aquariumId })
        .then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
        .catch((error) => res.status(400).json({ error }));
});

/**
 * @openapi
 * /api/aquarium/diagnostic/data/:
 *   post:
 *     tags:
 *     - aquarium
 *     summary: Creates a new data entry for a diagnostic
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diagnosticId
 *               - measure
 *               - frequency
 *             properties:
 *               diagnosticId:
 *                 type: string
 *               measure:
 *                 type: string
 *               frequency:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data created successfully"
 *       '400':
 *         description: All entries are required
 *       '500':
 *         description: Internal server error
 */
router.post("/diagnostic/data/", requireUser, async (req, res) => {
    const { diagnosticId } = req.body;
    const { measure } = req.body;
    const { frequency } = req.body;
    if (!diagnosticId || !measure || !frequency) {
        return res.status(400).json({ message: "All entries are required" });
    }
    const aquariumData = new AquariumData({
        diagnosticId,
        measure,
        frequency,
    });

    try {
        await aquariumData.save();
        res.status(201).json({ message: "Data created successfully" });
    } catch (e) {
        console.log("Error : ", e);
        res.status(500).json({ message: e });
    }
});

/**
 * @openapi
 * /api/aquarium/{aquariumId}/diagnostic/{diagnosticId}/data:
 *   get:
 *     tags:
 *     - aquarium
 *     summary: Fetches all data for a specific diagnostic of an aquarium
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: aquariumId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ID of the aquarium
 *     - in: path
 *       name: diagnosticId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ID of the diagnostic
 *     responses:
 *       '200':
 *         description: Returns a list of data for the diagnostic
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   diagnosticId:
 *                     type: string
 *       '400':
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get(
    "/:aquariumId/diagnostic/:diagnosticId/data",
    requireUser,
    async (req, res) => {
        const aquariumId = req.params.aquariumId;
        const diagnosticId = req.params.diagnosticId;
        await AquariumDiagnostic.find({ aquariumId: aquariumId })
            .then(
                await AquariumData.find({ diagnosticId: diagnosticId })
                    .then((aquariumData) => res.status(200).json(aquariumData))
                    .catch((error) => res.status(400).json({ error }))
            )
            .catch((error) => res.status(400).json({ error }));
    }
);

module.exports = router;
