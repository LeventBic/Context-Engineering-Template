import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productType, setProductType] = useState('all');
  const [form, setForm] = useState({
    sku: '', name: '', description: '', barcode: '', categoryId: '', supplierId: '',
    unitPrice: '', costPrice: '', unit: 'pcs', location: '', minStockLevel: 0,
    maxStockLevel: '', isRawMaterial: false, isFinishedProduct: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [searchTerm, selectedCategory, productType]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (productType !== 'all') params.append('type', productType);

      const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        fetch(`/api/products?${params}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/categories', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/suppliers', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const suppliersData = await suppliersRes.json();
      
      setProducts(productsData.data?.products || []);
      setCategories(categoriesData.data || []);
      setSuppliers(suppliersData.data || []);
      setLoading(false);
    } catch (err) {
      setError('Veriler alınamadı');
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        fetchData();
      } else {
        setError(data.message || 'İşlem başarısız');
      }
    } catch (err) {
      setError('İşlem başarısız');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      barcode: product.barcode || '',
      categoryId: product.category_id || '',
      supplierId: product.supplier_id || '',
      unitPrice: product.unit_price || '',
      costPrice: product.cost_price || '',
      unit: product.unit || 'pcs',
      location: product.location || '',
      minStockLevel: product.min_stock_level || 0,
      maxStockLevel: product.max_stock_level || '',
      isRawMaterial: product.is_raw_material || false,
      isFinishedProduct: product.is_finished_product || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
          fetchData();
        } else {
          setError(data.message || 'Silme başarısız');
        }
      } catch (err) {
        setError('Silme başarısız');
      }
    }
  };

  const resetForm = () => {
    setForm({
      sku: '', name: '', description: '', barcode: '', categoryId: '', supplierId: '',
      unitPrice: '', costPrice: '', unit: 'pcs', location: '', minStockLevel: 0,
      maxStockLevel: '', isRawMaterial: false, isFinishedProduct: false
    });
  };

  const getStockStatusBadge = (product) => {
    const status = product.stock_status;
    const colors = {
      'in_stock': 'bg-green-100 text-green-800',
      'low_stock': 'bg-yellow-100 text-yellow-800',
      'out_of_stock': 'bg-red-100 text-red-800',
      'overstock': 'bg-blue-100 text-blue-800'
    };
    const labels = {
      'in_stock': 'Stokta',
      'low_stock': 'Düşük Stok',
      'out_of_stock': 'Stok Yok',
      'overstock': 'Fazla Stok'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || 'Bilinmiyor'}
      </span>
    );
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Ürünler</h1>
          <p className="text-secondary-600">Tüm ürünleri yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingProduct(null); resetForm(); }}>
          Yeni Ürün
        </button>
      </div>

      {/* Arama ve Filtreler */}
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 text-sm">Arama</label>
            <input
              type="text"
              placeholder="Ürün adı, SKU veya barkod..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Kategori</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input w-full">
              <option value="">Tüm Kategoriler</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm">Ürün Tipi</label>
            <select value={productType} onChange={(e) => setProductType(e.target.value)} className="input w-full">
              <option value="all">Tümü</option>
              <option value="raw_material">Ham Madde</option>
              <option value="finished_product">Bitmiş Ürün</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setProductType('all'); }} className="btn btn-outline w-full">
              Temizle
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <form className="card p-4 space-y-4" onSubmit={handleSubmit}>
          <h3 className="font-semibold">{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">SKU *</label>
              <input type="text" name="sku" value={form.sku} onChange={handleFormChange} className="input w-full" required />
            </div>
            <div>
              <label className="block mb-1">Ürün Adı *</label>
              <input type="text" name="name" value={form.name} onChange={handleFormChange} className="input w-full" required />
            </div>
            <div>
              <label className="block mb-1">Barkod</label>
              <input type="text" name="barcode" value={form.barcode} onChange={handleFormChange} className="input w-full" />
            </div>
            <div>
              <label className="block mb-1">Kategori</label>
              <select name="categoryId" value={form.categoryId} onChange={handleFormChange} className="input w-full">
                <option value="">Seçiniz</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Tedarikçi</label>
              <select name="supplierId" value={form.supplierId} onChange={handleFormChange} className="input w-full">
                <option value="">Seçiniz</option>
                {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Birim</label>
              <select name="unit" value={form.unit} onChange={handleFormChange} className="input w-full">
                <option value="pcs">Adet</option>
                <option value="kg">Kilogram</option>
                <option value="lt">Litre</option>
                <option value="m">Metre</option>
                <option value="m2">Metrekare</option>
                <option value="m3">Metreküp</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Satış Fiyatı</label>
              <input type="number" name="unitPrice" value={form.unitPrice} onChange={handleFormChange} className="input w-full" step="0.01" min="0" />
            </div>
            <div>
              <label className="block mb-1">Maliyet Fiyatı</label>
              <input type="number" name="costPrice" value={form.costPrice} onChange={handleFormChange} className="input w-full" step="0.01" min="0" />
            </div>
            <div>
              <label className="block mb-1">Lokasyon</label>
              <input type="text" name="location" value={form.location} onChange={handleFormChange} className="input w-full" />
            </div>
            <div>
              <label className="block mb-1">Min. Stok Seviyesi</label>
              <input type="number" name="minStockLevel" value={form.minStockLevel} onChange={handleFormChange} className="input w-full" min="0" />
            </div>
            <div>
              <label className="block mb-1">Max. Stok Seviyesi</label>
              <input type="number" name="maxStockLevel" value={form.maxStockLevel} onChange={handleFormChange} className="input w-full" min="0" />
            </div>
            <div className="col-span-3">
              <label className="block mb-1">Açıklama</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} className="input w-full" rows="2" />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="checkbox" name="isRawMaterial" checked={form.isRawMaterial} onChange={handleFormChange} className="mr-2" />
              Ham Madde
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="isFinishedProduct" checked={form.isFinishedProduct} onChange={handleFormChange} className="mr-2" />
              Bitmiş Ürün
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-success">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">İptal</button>
          </div>
        </form>
      )}

      <div className="card p-4">
        <h2 className="font-semibold mb-4">Ürün Listesi ({products.length} ürün)</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Durum</th>
                <th>Satış Fiyatı</th>
                <th>Maliyet</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="font-mono">{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category_name || '-'}</td>
                  <td>{product.available_quantity || 0} {product.unit}</td>
                  <td>{getStockStatusBadge(product)}</td>
                  <td>₺{product.unit_price || 0}</td>
                  <td>₺{product.cost_price || 0}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/products/${product.id}`)} className="btn btn-xs btn-outline">Detay</button>
                      <button onClick={() => handleEdit(product)} className="btn btn-xs btn-outline">Düzenle</button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-xs btn-danger">Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

