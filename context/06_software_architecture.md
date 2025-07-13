# Software Architecture

# 06_software_architecture.md

## Yazılım Mimarisi ve Kod Organizasyonu

Bu doküman, AI Researcher Portfolio projesinin yazılım mimarisini, klasör yapısını, bileşen organizasyonunu ve veri akışını detaylandırmaktadır. Amaç, projenin ölçeklenebilir, sürdürülebilir, test edilebilir ve anlaşılır bir kod tabanına sahip olmasını sağlamaktır.

---

### 1. Genel Mimari Yaklaşımı

*   **Mimari Stil:** **Jamstack (JavaScript, APIs, Markup)**
    *   **Neden:** Bu mimari, performansı, güvenliği ve ölçeklenebilirliği artırır. Site, önceden oluşturulmuş statik HTML dosyaları olarak sunulur (SSG - Static Site Generation), bu da sunucu yükünü azaltır ve sayfa yüklenme hızlarını önemli ölçüde iyileştirir. Dinamik içerik, istemci tarafında API çağrıları ile veya Next.js'in Revalidation (ISR) özelliği ile güncellenebilir.

*   **Bileşen Tasarım Metodolojisi:** **Atomic Design**
    *   **Neden:** Bu metodoloji, UI'ı küçük, yeniden kullanılabilir parçalara (atomlar, moleküller, organizmalar) ayırarak tutarlı, ölçeklenebilir ve bakımı kolay bir bileşen kütüphanesi oluşturmayı sağlar. Her bir bileşenin tek bir sorumluluğu vardır ve bu bileşenler bir araya gelerek daha karmaşık yapılar oluşturur.

### 2. Klasör Yapısı (Next.js App Router)

Proje, Next.js'in App Router mimarisine uygun olarak aşağıdaki gibi yapılandırılacaktır:

ai-researcher-portfolio-v3/
├── public/                 # Statik dosyalar (resimler, fontlar, CV.pdf)
├── src/
│   ├── app/                # Uygulama rotaları ve sayfaları
│   │   ├── (main)/         # Ana layout'u paylaşan sayfalar
│   │   │   ├── about/      # Hakkımda sayfası
│   │   │   ├── blog/
│   │   │   │   ├── [slug]/ # Blog yazı detay sayfası
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── [slug]/ # Proje detay sayfası
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── layout.tsx      # Kök layout (<html>, <body>)
│   │   └── page.tsx        # Ana sayfa
│   ├── components/         # Yeniden kullanılabilir React bileşenleri
│   │   ├── atoms/          # En küçük UI parçaları (Button, Input, Logo)
│   │   ├── molecules/      # Atomların birleşimi (SearchBox, NavLink)
│   │   └── organisms/      # Karmaşık UI bölümleri (Header, Footer, ProjectList)
│   ├── lib/                # Yardımcı fonksiyonlar, kütüphane entegrasyonları
│   │   ├── mdx.ts          # MDX dosyalarını işleyen fonksiyonlar
│   │   └── utils.ts        # Genel yardımcı fonksiyonlar (örn: formatDate)
│   ├── data/               # Proje ve blog içeriklerinin bulunduğu yer
│   │   ├── blog/           # Blog yazıları (.mdx)
│   │   └── projects/       # Proje açıklamaları (.mdx)
│   └── styles/             # Global CSS dosyaları
│       └── globals.css     # Tailwind CSS direktifleri ve temel stiller
├── tailwind.config.ts      # Tailwind CSS yapılandırması
├── tsconfig.json           # TypeScript yapılandırması
└── ...                     # Diğer yapılandırma dosyaları

### 3. Bileşen Organizasyonu (Atomic Design Detayları)

*   **`src/components/atoms/`**
    *   **Tanım:** Arayüzün en temel yapı taşlarıdır. Kendi başlarına çok fazla işlevleri yoktur ve daha fazla parçalanamazlar.
    *   **Örnekler:** `Button.tsx`, `Input.tsx`, `Logo.tsx`, `Tag.tsx`, `Heading.tsx`.
    *   **Kural:** Atomlar, global uygulama state'inden haberdar olmamalıdır. Sadece aldıkları `props`'lara göre render edilmelidirler.

*   **`src/components/molecules/`**
    *   **Tanım:** Bir veya daha fazla atomun bir araya gelerek belirli bir işlevi yerine getirdiği bileşen gruplarıdır.
    *   **Örnekler:** `SearchBox.tsx` (`Input` ve `Button` atomlarından oluşur), `NavLink.tsx` (`Icon` ve `Text` atomlarından oluşur), `ProjectCard.tsx` (`Heading`, `Text`, `Tag` atomlarından oluşur).
    *   **Kural:** Moleküller, kendi içlerinde basit bir mantığa sahip olabilirler ancak karmaşık uygulama mantığı içermemelidirler.

*   **`src/components/organisms/`**
    *   **Tanım:** Atomlar ve moleküllerin birleşerek oluşturduğu, sayfanın büyük ve bağımsız bölümleridir.
    *   **Örnekler:** `Header.tsx` (`Logo` ve `NavLink`'lerden oluşan navigasyon), `Footer.tsx`, `ProjectList.tsx` (birden fazla `ProjectCard` molekülünü listeler), `BlogPost.tsx` (yazının başlığı, metni ve meta verilerini içerir).
    *   **Kural:** Organizmalar, veri çekme veya global state ile etkileşim gibi daha karmaşık iş mantıklarını içerebilirler.

### 4. Veri Akışı ve Yönetimi

*   **İçerik Kaynağı:** Tüm proje ve blog içerikleri, `src/data/` klasörü altındaki `.mdx` dosyalarında saklanacaktır. Bu, içeriğin koddan ayrılmasını ve kolayca yönetilmesini sağlar.
*   **Veri Çekme (Data Fetching):**
    *   Next.js App Router'da, sunucu bileşenleri (Server Components) varsayılan olarak kullanılır. Veri çekme işlemleri, doğrudan bu bileşenler içinde `async/await` kullanılarak yapılacaktır.
    *   `src/lib/mdx.ts` içinde, belirli bir `slug`'a sahip `.mdx` dosyasını okuyan ve içeriğini (metadata ve content) döndüren fonksiyonlar oluşturulacaktır.
    *   Örneğin, bir proje detay sayfasında (`/projects/[slug]/page.tsx`), ilgili projenin verileri, dosya sisteminden okunarak sayfaya aktarılacaktır.
*   **Statik Site Oluşturma (SSG):**
    *   Next.js, build aşamasında tüm sayfaları ve içerikleri statik olarak oluşturacaktır. Bu, `generateStaticParams` fonksiyonu kullanılarak dinamik rotaların (örn: tüm proje ve blog `slug`'ları) build zamanında bilinmesiyle sağlanır.
*   **İstemci Tarafı Etkileşim (Client-Side Interaction):**
    *   Kullanıcı etkileşimi gerektiren bileşenler (örn: tema değiştirici, mobil menü butonu), `'use client'` direktifi ile İstemci Bileşeni (Client Component) olarak işaretlenecektir.
    *   Genel uygulama state'i (örn: tema durumu) için React Context API veya basit state yönetimi için `useState` ve `useReducer` hook'ları kullanılacaktır. Karmaşık bir state yönetimi kütüphanesine (Redux, Zustand vb.) bu proje için gerek yoktur.

Bu mimari, projenin hem geliştirme sürecinde hem de son kullanıcı için yüksek kalitede olmasını sağlayacak sağlam bir temel oluşturur. Her bir bileşen ve modül, bu mimari prensiplere uygun olarak geliştirilecektir.