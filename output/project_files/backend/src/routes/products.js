const express = require('express')
const { body, validationResult, param, query: expressQuery } = require('express-validator')
const { query } = require('../config/database')
const { AppError } = require('../middleware/errorHandler')
const { requireAdminOrOperator } = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         sku:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         barcode:
 *           type: string
 *         categoryId:
 *           type: string
 *         unitPrice:
 *           type: number
 *         costPrice:
 *           type: number
 *         unit:
 *           type: string
 *         location:
 *           type: string
 *         minStockLevel:
 *           type: integer
 *         maxStockLevel:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         isRawMaterial:
 *           type: boolean
 *         isFinishedProduct:
 *           type: boolean
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [raw_material, finished_product, all]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get('/', [
  expressQuery('page').optional().isInt({ min: 1 }).toInt(),
  expressQuery('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  expressQuery('search').optional().trim(),
  expressQuery('category').optional().isUUID(),
  expressQuery('type').optional().isIn(['raw_material', 'finished_product', 'all'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      })
    }

    const page = req.query.page || 1
    const limit = req.query.limit || 20
    const offset = (page - 1) * limit
    const search = req.query.search
    const category = req.query.category
    const type = req.query.type

    let whereClause = 'WHERE p.is_active = true'
    const queryParams = []
    let paramCount = 0

    // Add search filter
    if (search) {
      paramCount++
      whereClause += ` AND (p.name ILIKE $${paramCount} OR p.sku ILIKE $${paramCount} OR p.barcode ILIKE $${paramCount})`
      queryParams.push(`%${search}%`)
    }

    // Add category filter
    if (category) {
      paramCount++
      whereClause += ` AND p.category_id = $${paramCount}`
      queryParams.push(category)
    }

    // Add type filter
    if (type === 'raw_material') {
      whereClause += ' AND p.is_raw_material = true'
    } else if (type === 'finished_product') {
      whereClause += ' AND p.is_finished_product = true'
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) 
      FROM products p 
      LEFT JOIN product_categories pc ON p.category_id = pc.id 
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const totalItems = parseInt(countResult.rows[0].count)

    // Get products with pagination
    paramCount++
    queryParams.push(limit)
    paramCount++
    queryParams.push(offset)

    const productsQuery = `
      SELECT 
        p.id, p.sku, p.name, p.description, p.barcode,
        p.category_id, pc.name as category_name,
        p.unit_price, p.cost_price, p.unit, p.location,
        p.min_stock_level, p.max_stock_level,
        p.is_active, p.is_raw_material, p.is_finished_product,
        p.created_at, p.updated_at,
        i.quantity, i.available_quantity,
        CASE 
          WHEN i.available_quantity <= p.min_stock_level THEN 'low'
          WHEN i.available_quantity >= p.max_stock_level THEN 'high'
          ELSE 'normal'
        END as stock_status
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN inventory i ON p.id = i.product_id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount-1} OFFSET $${paramCount}
    `

    const result = await query(productsQuery, queryParams)

    const totalPages = Math.ceil(totalItems / limit)

    res.json({
      status: 'success',
      data: {
        products: result.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid product ID')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      })
    }

    const productId = req.params.id

    const result = await query(`
      SELECT 
        p.id, p.sku, p.name, p.description, p.barcode,
        p.category_id, pc.name as category_name,
        p.unit_price, p.cost_price, p.unit, p.location,
        p.min_stock_level, p.max_stock_level,
        p.is_active, p.is_raw_material, p.is_finished_product,
        p.created_at, p.updated_at,
        i.quantity, i.reserved_quantity, i.available_quantity,
        CASE 
          WHEN i.available_quantity <= p.min_stock_level THEN 'low'
          WHEN i.available_quantity >= p.max_stock_level THEN 'high'
          ELSE 'normal'
        END as stock_status
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.id = $1
    `, [productId])

    if (result.rows.length === 0) {
      return next(new AppError('Product not found', 404))
    }

    res.json({
      status: 'success',
      data: {
        product: result.rows[0]
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - name
 *             properties:
 *               sku:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               barcode:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               unit:
 *                 type: string
 *               location:
 *                 type: string
 *               minStockLevel:
 *                 type: integer
 *               maxStockLevel:
 *                 type: integer
 *               isRawMaterial:
 *                 type: boolean
 *               isFinishedProduct:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', requireAdminOrOperator, [
  body('sku')
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU is required and must be max 50 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('SKU can only contain uppercase letters, numbers, hyphens, and underscores'),
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be max 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be max 500 characters'),
  body('barcode')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Barcode must be max 100 characters'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  body('unitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('costPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost price must be a positive number'),
  body('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Unit must be max 20 characters'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must be max 100 characters'),
  body('minStockLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stock level must be a non-negative integer'),
  body('maxStockLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum stock level must be a non-negative integer'),
  body('isRawMaterial')
    .optional()
    .isBoolean()
    .withMessage('Is raw material must be a boolean'),
  body('isFinishedProduct')
    .optional()
    .isBoolean()
    .withMessage('Is finished product must be a boolean')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      })
    }

    const {
      sku, name, description, barcode, categoryId, unitPrice, costPrice,
      unit, location, minStockLevel, maxStockLevel, isRawMaterial, isFinishedProduct
    } = req.body

    const result = await query(`
      INSERT INTO products (
        sku, name, description, barcode, category_id, unit_price, cost_price,
        unit, location, min_stock_level, max_stock_level, is_raw_material, is_finished_product
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      sku, name, description || null, barcode || null, categoryId || null,
      unitPrice || 0, costPrice || 0, unit || 'pcs', location || null,
      minStockLevel || 0, maxStockLevel || null, isRawMaterial || false, isFinishedProduct || false
    ])

    const newProduct = result.rows[0]

    // Initialize inventory for the new product
    await query('INSERT INTO inventory (product_id, quantity) VALUES ($1, $2)', [newProduct.id, 0])

    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    })
  } catch (error) {
    if (error.code === '23505') {
      const field = error.detail?.includes('sku') ? 'SKU' : 'barcode'
      return next(new AppError(`${field} already exists`, 409))
    }
    next(error)
  }
})

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               barcode:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               unit:
 *                 type: string
 *               location:
 *                 type: string
 *               minStockLevel:
 *                 type: integer
 *               maxStockLevel:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:id', requireAdminOrOperator, [
  param('id').isUUID().withMessage('Invalid product ID'),
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be max 500 characters'),
  body('unitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('costPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost price must be a positive number')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      })
    }

    const productId = req.params.id
    const updates = req.body

    // Build dynamic update query
    const updateFields = []
    const queryParams = []
    let paramCount = 0

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        paramCount++
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        updateFields.push(`${dbField} = $${paramCount}`)
        queryParams.push(updates[key])
      }
    })

    if (updateFields.length === 0) {
      return next(new AppError('No fields to update', 400))
    }

    paramCount++
    queryParams.push(productId)

    const result = await query(`
      UPDATE products 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount} AND is_active = true
      RETURNING *
    `, queryParams)

    if (result.rows.length === 0) {
      return next(new AppError('Product not found', 404))
    }

    res.json({
      status: 'success',
      data: {
        product: result.rows[0]
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', requireAdminOrOperator, [
  param('id').isUUID().withMessage('Invalid product ID')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      })
    }

    const productId = req.params.id

    const result = await query(
      'UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1 AND is_active = true RETURNING id',
      [productId]
    )

    if (result.rows.length === 0) {
      return next(new AppError('Product not found', 404))
    }

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router