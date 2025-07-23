const express = require('express')
const { requireAdminOrOperator } = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * /api/bom:
 *   get:
 *     summary: Get Bill of Materials
 *     tags: [BOM]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: BOM retrieved successfully
 */
router.get('/', async (req, res, next) => {
  res.json({ status: 'success', message: 'BOM endpoint - TODO: Implement' })
})

module.exports = router