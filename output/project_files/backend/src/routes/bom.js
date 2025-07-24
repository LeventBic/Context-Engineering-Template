const express = require('express')
const { requireAdminOrOperator } = require('../middleware/auth')
const db = require('../config/database')

const router = express.Router()

// Tüm BOM'ları listele
router.get('/', requireAdminOrOperator, async (req, res, next) => {
  try {
    const [boms] = await db.pool.execute(`
      SELECT b.*, p.name as product_name, p.sku as product_sku, u.username as created_by_username
      FROM bom b
      JOIN products p ON b.product_id = p.id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.is_active = TRUE
      ORDER BY b.created_at DESC
    `)
    res.json({ status: 'success', data: boms })
  } catch (err) {
    next(err)
  }
})

// BOM detayını getir (items ile birlikte)
router.get('/:id', requireAdminOrOperator, async (req, res, next) => {
  try {
    const { id } = req.params
    const [boms] = await db.pool.execute(`
      SELECT b.*, p.name as product_name, p.sku as product_sku, u.username as created_by_username
      FROM bom b
      JOIN products p ON b.product_id = p.id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.id = ? AND b.is_active = TRUE
    `, [id])
    
    if (boms.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'BOM bulunamadı' })
    }
    
    const [items] = await db.pool.execute(`
      SELECT bi.*, p.name as material_name, p.sku as material_sku, p.unit, p.cost_price
      FROM bom_items bi
      JOIN products p ON bi.material_id = p.id
      WHERE bi.bom_id = ?
      ORDER BY bi.sequence_number ASC
    `, [id])
    
    res.json({ status: 'success', data: { bom: boms[0], items } })
  } catch (err) {
    next(err)
  }
})

// Yeni BOM oluştur
router.post('/', requireAdminOrOperator, async (req, res, next) => {
  const connection = await db.pool.getConnection()
  try {
    await connection.beginTransaction()
    
    const { product_id, name, version, description, items } = req.body
    if (!product_id || !name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Ürün, BOM adı ve malzeme listesi zorunludur' })
    }
    
    // BOM oluştur
    const [result] = await connection.execute(`
      INSERT INTO bom (product_id, name, version, description, created_by)
      VALUES (?, ?, ?, ?, ?)
    `, [product_id, name, version || '1.0', description, req.user.id])
    
    const bomId = result.insertId
    
    // BOM items ekle
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await connection.execute(`
        INSERT INTO bom_items (bom_id, material_id, quantity, unit, sequence_number, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [bomId, item.material_id, item.quantity, item.unit || 'pcs', i + 1, item.notes])
    }
    
    await connection.commit()
    res.status(201).json({ status: 'success', message: 'BOM oluşturuldu', data: { id: bomId } })
  } catch (err) {
    await connection.rollback()
    next(err)
  } finally {
    connection.release()
  }
})

// BOM güncelle
router.put('/:id', requireAdminOrOperator, async (req, res, next) => {
  const connection = await db.pool.getConnection()
  try {
    await connection.beginTransaction()
    
    const { id } = req.params
    const { name, version, description, items } = req.body
    
    // BOM güncelle
    await connection.execute(`
      UPDATE bom SET name = ?, version = ?, description = ?, updated_at = NOW()
      WHERE id = ? AND is_active = TRUE
    `, [name, version, description, id])
    
    // Mevcut items'ları sil
    await connection.execute('DELETE FROM bom_items WHERE bom_id = ?', [id])
    
    // Yeni items ekle
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        await connection.execute(`
          INSERT INTO bom_items (bom_id, material_id, quantity, unit, sequence_number, notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [id, item.material_id, item.quantity, item.unit || 'pcs', i + 1, item.notes])
      }
    }
    
    await connection.commit()
    res.json({ status: 'success', message: 'BOM güncellendi' })
  } catch (err) {
    await connection.rollback()
    next(err)
  } finally {
    connection.release()
  }
})

// BOM sil (soft delete)
router.delete('/:id', requireAdminOrOperator, async (req, res, next) => {
  try {
    const { id } = req.params
    await db.pool.execute(`
      UPDATE bom SET is_active = FALSE, updated_at = NOW()
      WHERE id = ?
    `, [id])
    res.json({ status: 'success', message: 'BOM silindi' })
  } catch (err) {
    next(err)
  }
})

// BOM'dan üretim maliyeti hesapla
router.get('/:id/cost', requireAdminOrOperator, async (req, res, next) => {
  try {
    const { id } = req.params
    const { quantity = 1 } = req.query
    
    const [items] = await db.pool.execute(`
      SELECT bi.quantity, p.cost_price
      FROM bom_items bi
      JOIN products p ON bi.material_id = p.id
      WHERE bi.bom_id = ?
    `, [id])
    
    let totalCost = 0
    items.forEach(item => {
      totalCost += (item.quantity * item.cost_price * quantity)
    })
    
    res.json({ status: 'success', data: { total_cost: totalCost, quantity, cost_per_unit: totalCost / quantity } })
  } catch (err) {
    next(err)
  }
})

module.exports = router