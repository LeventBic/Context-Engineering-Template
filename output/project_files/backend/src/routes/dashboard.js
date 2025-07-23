const express = require('express')

const router = express.Router()

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get('/', async (req, res, next) => {
  res.json({ status: 'success', message: 'Dashboard endpoint - TODO: Implement' })
})

module.exports = router