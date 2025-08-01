const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth: authenticateToken, requireRole } = require('../middleware/auth');

// Tüm mevcut stoğu listele
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', supplier_id = '', category_id = '', stock_status = '' } = req.query;
        const offset = (page - 1) * limit;

        let whereConditions = [];
        let queryParams = [];

        // Arama filtresi
        if (search) {
            whereConditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.barcode LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // Tedarikçi filtresi
        if (supplier_id) {
            whereConditions.push('p.supplier_id = ?');
            queryParams.push(supplier_id);
        }

        // Kategori filtresi
        if (category_id) {
            whereConditions.push('p.category_id = ?');
            queryParams.push(category_id);
        }

        // Stok durumu filtresi
        if (stock_status) {
            switch (stock_status) {
                case 'out_of_stock':
                    whereConditions.push('i.available_quantity <= 0');
                    break;
                case 'low_stock':
                    whereConditions.push('i.available_quantity > 0 AND i.available_quantity <= p.min_stock_level');
                    break;
                case 'overstock':
                    whereConditions.push('i.available_quantity >= p.max_stock_level AND p.max_stock_level > 0');
                    break;
                case 'in_stock':
                    whereConditions.push('i.available_quantity > p.min_stock_level');
                    break;
            }
        }

        const whereClause = whereConditions.length > 0 ? `AND ${whereConditions.join(' AND ')}` : '';

        // Ana sorgu
        const query = `
            SELECT 
                p.id,
                p.uuid,
                p.sku,
                p.name,
                p.description,
                p.barcode,
                p.unit,
                p.location,
                p.min_stock_level,
                p.max_stock_level,
                p.reorder_point,
                p.reorder_quantity,
                p.unit_price,
                p.cost_price,
                p.expiry_date,
                p.batch_number,
                p.lead_time_days,
                COALESCE(i.available_quantity, 0) as available_quantity,
                COALESCE(i.reserved_quantity, 0) as reserved_quantity,
                COALESCE(i.total_quantity, 0) as total_quantity,
                i.last_count_date,
                pc.name as category_name,
                s.name as supplier_name,
                s.supplier_code,
                s.contact_person as supplier_contact,
                s.phone as supplier_phone,
                s.email as supplier_email,
                (COALESCE(i.available_quantity, 0) * p.unit_price) as stock_value,
                CASE 
                    WHEN COALESCE(i.available_quantity, 0) <= 0 THEN 'out_of_stock'
                    WHEN COALESCE(i.available_quantity, 0) <= p.min_stock_level THEN 'low_stock'
                    WHEN COALESCE(i.available_quantity, 0) >= p.max_stock_level AND p.max_stock_level > 0 THEN 'overstock'
                    ELSE 'in_stock'
                END as stock_status,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN inventory i ON p.id = i.product_id AND i.location = 'MAIN'
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.is_active = TRUE ${whereClause}
            ORDER BY p.name ASC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), parseInt(offset));

        // Count sorgusu
        const countQuery = `
            SELECT COUNT(*) as total
            FROM products p
            LEFT JOIN inventory i ON p.id = i.product_id AND i.location = 'MAIN'
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.is_active = TRUE ${whereClause}
        `;

        const [stockItems] = await db.pool.execute(query, queryParams);
        const [countResult] = await db.pool.execute(countQuery, queryParams.slice(0, -2));

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                items: stockItems,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Mevcut stok listesi getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// Tek ürün stok bilgisi getir
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.id,
                p.uuid,
                p.sku,
                p.name,
                p.description,
                p.barcode,
                p.unit,
                p.location,
                p.min_stock_level,
                p.max_stock_level,
                p.reorder_point,
                p.reorder_quantity,
                p.unit_price,
                p.cost_price,
                p.expiry_date,
                p.batch_number,
                p.lead_time_days,
                p.category_id,
                p.supplier_id,
                COALESCE(i.available_quantity, 0) as available_quantity,
                COALESCE(i.reserved_quantity, 0) as reserved_quantity,
                COALESCE(i.total_quantity, 0) as total_quantity,
                i.last_count_date,
                pc.name as category_name,
                s.name as supplier_name,
                s.supplier_code,
                s.contact_person as supplier_contact,
                s.phone as supplier_phone,
                s.email as supplier_email,
                (COALESCE(i.available_quantity, 0) * p.unit_price) as stock_value,
                CASE 
                    WHEN COALESCE(i.available_quantity, 0) <= 0 THEN 'out_of_stock'
                    WHEN COALESCE(i.available_quantity, 0) <= p.min_stock_level THEN 'low_stock'
                    WHEN COALESCE(i.available_quantity, 0) >= p.max_stock_level AND p.max_stock_level > 0 THEN 'overstock'
                    ELSE 'in_stock'
                END as stock_status,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN inventory i ON p.id = i.product_id AND i.location = 'MAIN'
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.is_active = TRUE AND p.id = ?
        `;

        const [result] = await db.pool.execute(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        res.json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        console.error('Ürün stok bilgisi getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// Yeni ürün ekle
router.post('/', authenticateToken, requireRole(['admin', 'operator']), async (req, res) => {
    const connection = await db.pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const {
            sku,
            name,
            description,
            barcode,
            category_id,
            supplier_id,
            unit_price,
            cost_price,
            unit,
            location,
            min_stock_level,
            max_stock_level,
            reorder_point,
            reorder_quantity,
            lead_time_days,
            expiry_date,
            batch_number,
            available_quantity = 0,
            is_raw_material = false,
            is_finished_product = false
        } = req.body;

        // Validasyon
        if (!sku || !name) {
            return res.status(400).json({
                success: false,
                message: 'SKU ve ürün adı zorunludur'
            });
        }

        // SKU benzersizlik kontrolü
        const [existingSku] = await connection.execute(
            'SELECT id FROM products WHERE sku = ? AND is_active = TRUE',
            [sku]
        );

        if (existingSku.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu SKU zaten kullanılıyor'
            });
        }

        // Barcode benzersizlik kontrolü
        if (barcode) {
            const [existingBarcode] = await connection.execute(
                'SELECT id FROM products WHERE barcode = ? AND is_active = TRUE',
                [barcode]
            );

            if (existingBarcode.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu barkod zaten kullanılıyor'
                });
            }
        }

        // Ürün ekle
        const [productResult] = await connection.execute(`
            INSERT INTO products (
                sku, name, description, barcode, category_id, supplier_id,
                unit_price, cost_price, unit, location, min_stock_level,
                max_stock_level, reorder_point, reorder_quantity, lead_time_days,
                expiry_date, batch_number, is_raw_material, is_finished_product
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            sku, name, description, barcode, category_id, supplier_id,
            unit_price, cost_price, unit, location, min_stock_level,
            max_stock_level, reorder_point, reorder_quantity, lead_time_days,
            expiry_date, batch_number, is_raw_material, is_finished_product
        ]);

        const productId = productResult.insertId;

        // Envanter girişi yap
        if (available_quantity > 0) {
            await connection.execute(`
                INSERT INTO inventory (product_id, location, available_quantity)
                VALUES (?, 'MAIN', ?)
            `, [productId, available_quantity]);

            // Stok hareketi kaydet
            await connection.execute(`
                INSERT INTO stock_movements (
                    product_id, movement_type, quantity, reference_type,
                    location_to, notes, created_by
                ) VALUES (?, 'in', ?, 'adjustment', 'MAIN', 'İlk stok girişi', ?)
            `, [productId, available_quantity, req.user.id]);
        } else {
            // Sıfır miktarla envanter girişi
            await connection.execute(`
                INSERT INTO inventory (product_id, location, available_quantity)
                VALUES (?, 'MAIN', 0)
            `, [productId]);
        }

        await connection.commit();

        // Yeni eklenen ürünü getir
        const [newProduct] = await connection.execute(`
            SELECT 
                p.*,
                COALESCE(i.available_quantity, 0) as available_quantity,
                pc.name as category_name,
                s.name as supplier_name
            FROM products p
            LEFT JOIN inventory i ON p.id = i.product_id AND i.location = 'MAIN'
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = ?
        `, [productId]);

        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla eklendi',
            data: newProduct[0]
        });

    } catch (error) {
        await connection.rollback();
        console.error('Ürün ekleme hatası:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'SKU veya barkod zaten kullanılıyor'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Ürün güncelle
router.put('/:id', authenticateToken, requireRole(['admin', 'operator']), async (req, res) => {
    const connection = await db.pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const {
            sku,
            name,
            description,
            barcode,
            category_id,
            supplier_id,
            unit_price,
            cost_price,
            unit,
            location,
            min_stock_level,
            max_stock_level,
            reorder_point,
            reorder_quantity,
            lead_time_days,
            expiry_date,
            batch_number,
            available_quantity
        } = req.body;

        // Ürün var mı kontrol et
        const [existingProduct] = await connection.execute(
            'SELECT id FROM products WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        // SKU benzersizlik kontrolü (kendi ID'si hariç)
        if (sku) {
            const [existingSku] = await connection.execute(
                'SELECT id FROM products WHERE sku = ? AND id != ? AND is_active = TRUE',
                [sku, id]
            );

            if (existingSku.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu SKU zaten kullanılıyor'
                });
            }
        }

        // Barcode benzersizlik kontrolü (kendi ID'si hariç)
        if (barcode) {
            const [existingBarcode] = await connection.execute(
                'SELECT id FROM products WHERE barcode = ? AND id != ? AND is_active = TRUE',
                [barcode, id]
            );

            if (existingBarcode.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu barkod zaten kullanılıyor'
                });
            }
        }

        // Ürün bilgilerini güncelle
        await connection.execute(`
            UPDATE products SET
                sku = COALESCE(?, sku),
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                barcode = ?,
                category_id = ?,
                supplier_id = ?,
                unit_price = COALESCE(?, unit_price),
                cost_price = COALESCE(?, cost_price),
                unit = COALESCE(?, unit),
                location = COALESCE(?, location),
                min_stock_level = COALESCE(?, min_stock_level),
                max_stock_level = ?,
                reorder_point = COALESCE(?, reorder_point),
                reorder_quantity = COALESCE(?, reorder_quantity),
                lead_time_days = COALESCE(?, lead_time_days),
                expiry_date = ?,
                batch_number = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            sku, name, description, barcode, category_id, supplier_id,
            unit_price, cost_price, unit, location, min_stock_level,
            max_stock_level, reorder_point, reorder_quantity, lead_time_days,
            expiry_date, batch_number, id
        ]);

        // Stok miktarını güncelle (eğer verilmişse)
        if (available_quantity !== undefined) {
            // Mevcut stok miktarını al
            const [currentStock] = await connection.execute(
                'SELECT available_quantity FROM inventory WHERE product_id = ? AND location = "MAIN"',
                [id]
            );

            const currentQuantity = currentStock.length > 0 ? currentStock[0].available_quantity : 0;
            const difference = available_quantity - currentQuantity;

            if (difference !== 0) {
                // Envanter güncelle
                await connection.execute(`
                    INSERT INTO inventory (product_id, location, available_quantity)
                    VALUES (?, 'MAIN', ?)
                    ON DUPLICATE KEY UPDATE available_quantity = ?
                `, [id, available_quantity, available_quantity]);

                // Stok hareketi kaydet
                const movementType = difference > 0 ? 'in' : 'out';
                const movementQuantity = Math.abs(difference);

                await connection.execute(`
                    INSERT INTO stock_movements (
                        product_id, movement_type, quantity, reference_type,
                        location_to, notes, created_by
                    ) VALUES (?, ?, ?, 'adjustment', 'MAIN', 'Manuel stok düzeltmesi', ?)
                `, [id, movementType, movementQuantity, req.user.id]);
            }
        }

        await connection.commit();

        // Güncellenmiş ürünü getir
        const [updatedProduct] = await connection.execute(`
            SELECT 
                p.*,
                COALESCE(i.available_quantity, 0) as available_quantity,
                pc.name as category_name,
                s.name as supplier_name
            FROM products p
            LEFT JOIN inventory i ON p.id = i.product_id AND i.location = 'MAIN'
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = ?
        `, [id]);

        res.json({
            success: true,
            message: 'Ürün başarıyla güncellendi',
            data: updatedProduct[0]
        });

    } catch (error) {
        await connection.rollback();
        console.error('Ürün güncelleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Ürün sil (soft delete)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;

        // Ürün var mı kontrol et
        const [existingProduct] = await db.pool.execute(
            'SELECT id, name FROM products WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        // Soft delete
        await db.pool.execute(
            'UPDATE products SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: `${existingProduct[0].name} ürünü başarıyla silindi`
        });

    } catch (error) {
        console.error('Ürün silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// Stok hareketi ekle
router.post('/:id/movement', authenticateToken, requireRole(['admin', 'operator']), async (req, res) => {
    const connection = await db.pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { movement_type, quantity, unit_cost, supplier_id, batch_number, expiry_date, notes } = req.body;

        // Validasyon
        if (!movement_type || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Hareket tipi ve miktar zorunludur'
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Miktar pozitif olmalıdır'
            });
        }

        // Ürün var mı kontrol et
        const [product] = await connection.execute(
            'SELECT id, name FROM products WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        // Çıkış hareketinde yeterli stok var mı kontrol et
        if (movement_type === 'out') {
            const [currentStock] = await connection.execute(
                'SELECT available_quantity FROM inventory WHERE product_id = ? AND location = "MAIN"',
                [id]
            );

            const availableQuantity = currentStock.length > 0 ? currentStock[0].available_quantity : 0;

            if (availableQuantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Yetersiz stok. Mevcut: ${availableQuantity}, Talep edilen: ${quantity}`
                });
            }
        }

        // Stok hareketi kaydet
        await connection.execute(`
            INSERT INTO stock_movements (
                product_id, movement_type, quantity, unit_cost, supplier_id,
                batch_number, expiry_date, reference_type, location_to,
                notes, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'adjustment', 'MAIN', ?, ?)
        `, [id, movement_type, quantity, unit_cost, supplier_id, batch_number, expiry_date, notes, req.user.id]);

        await connection.commit();

        res.json({
            success: true,
            message: 'Stok hareketi başarıyla kaydedildi'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Stok hareketi ekleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Ürünün stok hareketlerini listele
router.get('/:id/movements', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                sm.id,
                sm.uuid,
                sm.movement_type,
                sm.quantity,
                sm.unit_cost,
                sm.reference_type,
                sm.batch_number,
                sm.expiry_date,
                sm.notes,
                sm.created_at,
                u.first_name,
                u.last_name,
                s.name as supplier_name
            FROM stock_movements sm
            LEFT JOIN users u ON sm.created_by = u.id
            LEFT JOIN suppliers s ON sm.supplier_id = s.id
            WHERE sm.product_id = ?
            ORDER BY sm.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [movements] = await db.pool.execute(query, [id, parseInt(limit), parseInt(offset)]);

        // Count sorgusu
        const [countResult] = await db.pool.execute(
            'SELECT COUNT(*) as total FROM stock_movements WHERE product_id = ?',
            [id]
        );

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                movements,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Stok hareketleri getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

module.exports = router; 