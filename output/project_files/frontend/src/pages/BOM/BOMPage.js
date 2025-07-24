import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BOMPage = () => {
  const [boms, setBoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBom, setEditingBom] = useState(null);
  const [form, setForm] = useState({ product_id: '', name: '', version: '1.0', description: '', items: [] });
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bomsRes, productsRes, materialsRes] = await Promise.all([
        fetch('/api/bom', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/products', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/products?type=raw_material', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      
      const bomsData = await bomsRes.json();
      const productsData = await productsRes.json();
      const materialsData = await materialsRes.json();
      
      setBoms(bomsData.data || []);
      setProducts(productsData.data?.products || []);
      setMaterials(materialsData.data?.products || []);
      setLoading(false);
    } catch (err) {
      setError('Veriler alınamadı');
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { material_id: '', quantity: 1, unit: 'pcs', notes: '' }] });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingBom ? 'PUT' : 'POST';
      const url = editingBom ? `/api/bom/${editingBom.id}` : '/api/bom';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setShowForm(false);
        setEditingBom(null);
        setForm({ product_id: '', name: '', version: '1.0', description: '', items: [] });
        fetchData();
      } else {
        setError(data.message || 'İşlem başarısız');
      }
    } catch (err) {
      setError('İşlem başarısız');
    }
  };

  const handleEdit = async (bom) => {
    try {
      const response = await fetch(`/api/bom/${bom.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEditingBom(bom);
        setForm({
          product_id: data.data.bom.product_id,
          name: data.data.bom.name,
          version: data.data.bom.version,
          description: data.data.bom.description,
          items: data.data.items || []
        });
        setShowForm(true);
      }
    } catch (err) {
      setError('BOM detayı alınamadı');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu BOM\'u silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/bom/${id}`, {
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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Malzeme Listesi (BOM)</h1>
          <p className="text-secondary-600">Ürün malzeme listelerini yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingBom(null); setForm({ product_id: '', name: '', version: '1.0', description: '', items: [] }); }}>
          Yeni BOM
        </button>
      </div>

      {showForm && (
        <form className="card p-4 space-y-4" onSubmit={handleSubmit}>
          <h3 className="font-semibold">{editingBom ? 'BOM Düzenle' : 'Yeni BOM Oluştur'}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Ürün</label>
              <select name="product_id" value={form.product_id} onChange={handleFormChange} className="input w-full" required>
                <option value="">Seçiniz</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">BOM Adı</label>
              <input type="text" name="name" value={form.name} onChange={handleFormChange} className="input w-full" required />
            </div>
            <div>
              <label className="block mb-1">Versiyon</label>
              <input type="text" name="version" value={form.version} onChange={handleFormChange} className="input w-full" />
            </div>
            <div>
              <label className="block mb-1">Açıklama</label>
              <input type="text" name="description" value={form.description} onChange={handleFormChange} className="input w-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Malzemeler</label>
              <button type="button" onClick={addItem} className="btn btn-sm btn-outline">Malzeme Ekle</button>
            </div>
            
            {form.items.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 mb-2 p-2 border rounded">
                <select value={item.material_id} onChange={(e) => handleItemChange(index, 'material_id', e.target.value)} className="input" required>
                  <option value="">Malzeme Seç</option>
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <input type="number" placeholder="Miktar" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="input" required min="0.001" step="0.001" />
                <input type="text" placeholder="Birim" value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} className="input" />
                <input type="text" placeholder="Not" value={item.notes} onChange={(e) => handleItemChange(index, 'notes', e.target.value)} className="input" />
                <button type="button" onClick={() => removeItem(index)} className="btn btn-sm btn-danger">Sil</button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-success">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">İptal</button>
          </div>
        </form>
      )}

      <div className="card p-4">
        <h2 className="font-semibold mb-4">BOM Listesi</h2>
        <table className="table-auto w-full text-sm">
          <thead>
            <tr>
              <th>BOM Adı</th>
              <th>Ürün</th>
              <th>Versiyon</th>
              <th>Açıklama</th>
              <th>Oluşturan</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {boms.map(bom => (
              <tr key={bom.id} className="border-b hover:bg-gray-50">
                <td>{bom.name}</td>
                <td>{bom.product_name} ({bom.product_sku})</td>
                <td>{bom.version}</td>
                <td>{bom.description}</td>
                <td>{bom.created_by_username}</td>
                <td>{new Date(bom.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(bom)} className="btn btn-xs btn-outline">Düzenle</button>
                    <button onClick={() => handleDelete(bom.id)} className="btn btn-xs btn-danger">Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BOMPage;
