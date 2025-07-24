const express = require('express')
const { requireAdminOrOperator } = require('../middleware/auth')
const db = require('../config/database')

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

// Stok raporu: tüm ürünlerin stok durumu ve değerleri
router.get('/stock', requireAdminOrOperator, async (req, res, next) => {
  try {
    const [rows] = await db.pool.execute(`
      SELECT p.id, p.name, p.sku, p.unit, p.unit_price, i.available_quantity, (i.available_quantity * p.unit_price) as stock_value
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.is_active = TRUE
      ORDER BY p.name ASC
    `)
    res.json({ status: 'success', data: rows })
  } catch (err) {
    next(err)
  }
})

// Üretim raporu: üretim emirleri ve durumları
router.get('/production', requireAdminOrOperator, async (req, res, next) => {
  try {
    const [rows] = await db.pool.execute(`
      SELECT po.*, b.name as bom_name, u.username as created_by_username
      FROM production_orders po
      JOIN bom b ON po.bom_id = b.id
      LEFT JOIN users u ON po.created_by = u.id
      ORDER BY po.created_at DESC
    `)
    res.json({ status: 'success', data: rows })
  } catch (err) {
    next(err)
  }
})

// Satış raporu: satış siparişleri ve toplamlar
router.get('/sales', requireAdminOrOperator, async (req, res, next) => {
  try {
    const [rows] = await db.pool.execute(`
      SELECT so.id, so.order_number, so.order_date, so.status, so.total_amount, so.tax_amount, so.total_with_tax, c.name as customer_name, u.username as created_by_username
      FROM sales_orders so
      LEFT JOIN customers c ON so.customer_id = c.id
      LEFT JOIN users u ON so.created_by = u.id
      ORDER BY so.order_date DESC
    `)
    res.json({ status: 'success', data: rows })
  } catch (err) {
    next(err)
  }
})

module.exports = router