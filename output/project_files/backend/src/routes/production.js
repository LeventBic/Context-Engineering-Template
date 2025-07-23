const express = require('express')
const { requireAdminOrOperator } = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * /api/production:
 *   get:
 *     summary: Get production orders
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Production orders retrieved successfully
 */
router.get('/', async (req, res, next) => {
  res.json({ status: 'success', message: 'Production endpoint - TODO: Implement' })
})

module.exports = router