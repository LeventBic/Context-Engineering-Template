# Tech Stack

# 05_tech_stack.md

## Proje Teknoloji Yığını (Tech Stack)

Bu doküman, AI Researcher Portfolio projesinin geliştirilmesinde kullanılacak tüm programlama dillerini, frameworkleri, kütüphaneleri, araçları ve platformları detaylandırmaktadır. Belirtilen teknolojilere harfiyen uyulmalı ve bu listenin dışına çıkılmamalıdır. Her bir seçimin arkasındaki mantık da açıklanmıştır.

---

### 1. Temel Geliştirme Ortamı

*   **Programlama Dili:** **TypeScript (v5.x)**
    *   **Neden:** JavaScript'in süper kümesi olan TypeScript, statik tip kontrolü sağlayarak büyük ölçekli uygulamalarda hata yakalamayı kolaylaştırır, kodun okunabilirliğini ve bakımını artırır. Özellikle karmaşık veri yapıları ve API entegrasyonları için vazgeçilmezdir.
    *   **Yapılandırma:** `tsconfig.json` dosyasında `strict: true` ayarı aktif olmalıdır. Bu, daha katı tip denetimi sağlayarak potansiyel hataları en aza indirir.

*   **Paket Yöneticisi:** **pnpm (v8.x)**
    *   **Neden:** `npm` ve `yarn`'a göre daha hızlı ve disk alanı açısından daha verimlidir. Bağımlılıkları tek bir merkezi konumda saklayarak projeler arasında paylaşım sağlar ve disk kullanımını optimize eder.

### 2. Frontend Geliştirme

*   **React Framework:** **Next.js (v14.x)**
    *   **Neden:** Sunucu Tarafı Oluşturma (SSR), Statik Site Oluşturma (SSG) ve İstemci Tarafı Oluşturma (CSR) yeteneklerini bir arada sunarak performans, SEO ve geliştirici deneyimi açısından üstünlük sağlar. App Router mimarisi ile modern React geliştirme pratiklerini destekler. Veri çekme, yönlendirme ve API rotaları için yerleşik çözümler sunar.
    *   **Yapılandırma:** App Router (öncelikli), Server Components (performans kritik alanlarda), Client Components (interaktif UI için).

*   **Styling (CSS Framework):** **Tailwind CSS (v3.x)**
    *   **Neden:** Utility-first CSS framework'ü, hızlı UI geliştirme imkanı sunar. Önceden tanımlanmış sınıflarla doğrudan HTML içinde stil tanımlamayı sağlar, bu da CSS dosya boyutunu küçültür ve stil çakışmalarını önler. Tamamen özelleştirilebilir olması, `08_ui_ux_guidelines.md` dosyasındaki tasarım prensiplerine tam uyum sağlamayı kolaylaştırır.
    *   **Yapılandırma:** `tailwind.config.js` dosyası, `08_ui_ux_guidelines.md` dosyasındaki renk paleti, tipografi ve boşluk kurallarına göre özelleştirilecektir.

*   **İçerik Yönetimi:** **Markdown (.mdx)**
    *   **Neden:** Blog yazıları, proje açıklamaları ve diğer statik içerikler için hafif, okunabilir ve sürüm kontrol sistemleriyle uyumlu bir format sunar. `.mdx` uzantısı, Markdown dosyaları içine React bileşenleri gömme yeteneği sağlayarak zengin içerik oluşturmayı mümkün kılar.
    *   **Araçlar:** `next-mdx-remote` veya benzeri bir kütüphane, `.mdx` dosyalarını Next.js uygulamasına entegre etmek için kullanılacaktır.

### 3. Kod Kalitesi ve Geliştirici Deneyimi

*   **Linting:** **ESLint (v8.x)**
    *   **Neden:** Kod kalitesini ve tutarlılığını sağlamak için statik kod analizi yapar. Potansiyel hataları ve kötü kodlama pratiklerini geliştirme aşamasında tespit eder.
    *   **Yapılandırma:** `eslint-config-next`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y` ve `@typescript-eslint/eslint-plugin` gibi eklentilerle yapılandırılacaktır. `03_rules.md` dosyasındaki kurallara uygun özel kurallar eklenebilir.

*   **Formatting:** **Prettier (v3.x)**
    *   **Neden:** Kodun otomatik olarak biçimlendirilmesini sağlayarak kod tabanında tutarlı bir stil sağlar. Geliştiricilerin stil tartışmaları yerine iş mantığına odaklanmasına yardımcı olur.
    *   **Yapılandırma:** `.prettierrc` dosyası, ESLint kurallarıyla çakışmayacak şekilde yapılandırılacaktır.

*   **Versiyon Kontrol Sistemi:** **Git**
    *   **Neden:** Kod tabanının sürüm kontrolünü sağlamak, değişiklikleri takip etmek ve işbirliğini kolaylaştırmak için endüstri standardıdır.

### 4. Dağıtım (Deployment)

*   **Platform:** **Vercel**
    *   **Neden:** Next.js uygulamaları için optimize edilmiş, sunucusuz (serverless) bir dağıtım platformudur. Otomatik dağıtım, CDN entegrasyonu, anında önizleme URL'leri ve global performans avantajları sunar. Dr. Yılmaz'ın portfolyosunun hızlı ve güvenilir bir şekilde yayınlanmasını sağlar.

### 5. Diğer Potansiyel Kütüphaneler (İhtiyaç Halinde Eklenecekler)

*   **Animasyon Kütüphanesi:** `Framer Motion` (v10.x) - Mikro etkileşimler ve sayfa geçişleri için.
*   **İkon Kütüphanesi:** `React Icons` veya `Lucide React` - UI'da kullanılacak ikonlar için.
*   **Form Yönetimi:** `React Hook Form` (v7.x) ve `Zod` (v3.x) - İletişim formu gibi karmaşık formların yönetimi ve validasyonu için.
*   **Veri Görselleştirme:** `Recharts` veya `Nivo` - Eğer projelerde veya yayınlarda veri görselleştirmeleri gerekiyorsa.

Bu teknoloji yığını, projenin performans, ölçeklenebilirlik, bakım kolaylığı ve geliştirici deneyimi açısından en iyi uygulamaları takip etmesini sağlayacaktır. Herhangi bir yeni teknoloji veya kütüphane eklenmeden önce bu doküman güncellenmeli ve kullanıcının onayı alınmalıdır.
