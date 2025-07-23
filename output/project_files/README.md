# inFlow Benzeri Stok ve Üretim Yönetimi Uygulaması

Bu uygulama, küçük ve orta ölçekli işletmeler için stok takibi ve üretim süreçlerini yöneten web tabanlı bir çözümdür.

## 🚀 Özellikler

### 📦 Stok Takibi
- Ürün ekleme/düzenleme/silme (SKU, barkod, konum bilgileriyle)
- Stok adedi takibi ve düşük stok uyarıları
- Stok geçmişi ve hareket takibi
- Barkod tarayıcı desteği

### 🏭 Üretim Modülü
- Malzeme Listesi (BOM) yönetimi
- Üretim emri oluşturma ve takibi
- Devam eden üretim (WIP) takibi
- Üretim maliyeti ve süre analizi

### 👥 Kullanıcı Yönetimi
- Rol tabanlı erişim kontrolü (Admin, Operatör, Görüntüleyici)
- Kullanıcı girişi ve yetkilendirme
- Güvenli oturum yönetimi

### 📊 Dashboard ve Raporlama
- Gerçek zamanlı envanter göstergeleri
- Üretim performans metrikleri
- Interaktif grafikler ve tablolar

## 🛠 Teknoloji Stack

### Backend
- **Framework**: Node.js + Express.js
- **Veritabanı**: PostgreSQL
- **Authentication**: JWT
- **API**: RESTful API

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (opsiyonel)
- **HTTP Client**: Axios
- **Charts**: Recharts

### DevOps
- **Containerization**: Docker
- **Process Manager**: PM2

## 📁 Proje Yapısı

```
inflow-app/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── database/           # Database scripts
│   │   ├── migrations/     # Database migrations
│   │   └── seeds/          # Sample data
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store (opsiyonel)
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
├── docs/                   # Documentation
└── docker-compose.yml      # Docker configuration
```

## 🚦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### Adım Adım Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd inflow-app
```

2. **Backend kurulumu:**
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run migrate
npm run seed
npm run dev
```

3. **Frontend kurulumu:**
```bash
cd frontend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm start
```

4. **Docker ile kurulum (opsiyonel):**
```bash
docker-compose up -d
```

## 🔐 Varsayılan Kullanıcılar

- **Admin**: admin@inflow.com / admin123
- **Operatör**: operator@inflow.com / operator123
- **Görüntüleyici**: viewer@inflow.com / viewer123

## 📖 API Dokümantasyonu

API dokümantasyonu: `http://localhost:3000/api/docs`

## 🧪 Test

```bash
# Backend testleri
cd backend && npm test

# Frontend testleri
cd frontend && npm test
```

## 🚀 Production Deployment

```bash
# Build frontend
cd frontend && npm run build

# Start production backend
cd backend && npm run start:prod
```

## 📄 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun için issue oluşturun veya iletişime geçin. 