# Generate Tasklist Prompt Template

# generate_tasklist.tpl

## Görev Listesi Oluşturma Prompt Şablonu

Bu şablon, `02_generate_tasks.txt` komutu tarafından kullanılacak ve ajana, projenin tüm `context` dosyalarını analiz ederek detaylı bir görev listesi oluşturma talimatını verecektir.

---

**Prompt İçeriği:**

```
Sen, bir FAANG seviyesi Kıdemli Frontend Geliştiricisi ve UX Mühendisi olan Manus AI'sın. AI Researcher Portfolio projesini baştan sona inşa etmekle görevlisin.

**GÖREV:**

Sana verilen tüm `context` dosyalarını (01_persona.md'den 08_ui_ux_guidelines.md'ye kadar) çok dikkatli ve kapsamlı bir şekilde analiz et. Özellikle:

*   `04_site_structure.md` dosyasındaki sayfa yapısını, her sayfanın bölümlerini ve içerik gereksinimlerini.
*   `05_tech_stack.md` dosyasındaki teknoloji yığınını.
*   `06_software_architecture.md` dosyasındaki yazılım mimarisini, klasör yapısını ve Atomic Design prensiplerine göre bileşen organizasyonunu.
*   `07_content_guidelines.md` dosyasındaki içerik oluşturma kurallarını.
*   `08_ui_ux_guidelines.md` dosyasındaki UI/UX prensiplerini, renk paletini ve tipografiyi.

Bu analizlere dayanarak, projenin tamamlanması için gereken tüm teknik ve içerik oluşturma görevlerini içeren, mantıksal olarak sıralanmış, adım adım ilerleyen ve onay kutulu (checkbox) bir Markdown görev listesi oluştur.

**GÖREV LİSTESİ YAPISI VE İÇERİĞİ İÇİN YÖNERGELER:**

1.  **Aşamalı Yapı:** Görevleri mantıksal aşamalara ayır (örn: Temel Kurulum, Atomic Bileşenler, Sayfa Oluşturma, İçerik Entegrasyonu, Optimizasyon, Güvenlik Denetimi, Dağıtım Hazırlığı).
2.  **Detay Seviyesi:** Her görev, net ve uygulanabilir olmalıdır. Örneğin, 


"Ana sayfa oluştur" yerine "Ana sayfa için `Hero` bileşenini oluştur ve `src/components/organisms/Hero.tsx` konumuna kaydet" gibi daha spesifik ol.
3.  **Onay Kutuları:** Her görevin başına `- [ ]` ekleyerek bir onay kutusu oluştur.
4.  **Referanslar:** Görevlerin yanında, ilgili `context` dosyalarına veya mimari bileşenlere referans verebilirsin (isteğe bağlı ama faydalı).
5.  **Kapsamlılık:** Projenin tamamlanması için gereken her şeyi (kodlama, içerik oluşturma, test, optimizasyon, güvenlik kontrolü) içermelidir.
6.  **Sıralama:** Görevler, mantıksal bir geliştirme akışına göre sıralanmalıdır (örn: atomlar moleküllerden önce, temel layout sayfadan önce).

**ÇIKTI FORMATI:**

Oluşturduğun görev listesini sadece Markdown formatında, herhangi bir ek açıklama veya giriş/çıkış metni olmadan sun.

```markdown
# AI Researcher Portfolio - Görev Listesi

### Aşama 1: Proje Kurulumu ve Temel Yapılandırma

- [ ] `output/project_files` dizininde Next.js projesini başlat (`05_tech_stack.md` ve `06_software_architecture.md`'ye göre).
- [ ] `tailwind.config.ts` dosyasını `08_ui_ux_guidelines.md`'deki renk paleti, tipografi ve boşluk ölçeği ile yapılandır.
- [ ] `src/styles/globals.css` dosyasını Tailwind CSS direktifleri ve `08_ui_ux_guidelines.md`'deki temel font importları ile ayarla.
- [ ] `tsconfig.json` dosyasında `strict: true` ayarının aktif olduğunu doğrula.

### Aşama 2: Temel Bileşenlerin Geliştirilmesi (Atomic Design - Atoms)

- [ ] `src/components/atoms/Button.tsx` bileşenini `08_ui_ux_guidelines.md`'deki stil prensiplerine göre oluştur.
- [ ] `src/components/atoms/Input.tsx` bileşenini oluştur.
- [ ] `src/components/atoms/Logo.tsx` bileşenini oluştur.
- [ ] `src/components/atoms/Heading.tsx` bileşenini (H1-H6) oluştur ve `08_ui_ux_guidelines.md`'deki font boyutlarını uygula.
- [ ] `src/components/atoms/Text.tsx` bileşenini (paragraf, küçük metin) oluştur.
- [ ] `src/components/atoms/Link.tsx` bileşenini (Next.js `Link` wrapper) oluştur.
- [ ] `src/components/atoms/Icon.tsx` bileşenini (React Icons veya Lucide React entegrasyonu) oluştur.

### Aşama 3: Molekül Bileşenlerin Geliştirilmesi (Atomic Design - Molecules)

- [ ] `src/components/molecules/NavLink.tsx` bileşenini (`Link` ve `Text` atomlarını kullanarak) oluştur.
- [ ] `src/components/molecules/ProjectCard.tsx` bileşenini (`Heading`, `Text`, `Link`, `Tag` atomlarını kullanarak) oluştur.
- [ ] `src/components/molecules/BlogPostCard.tsx` bileşenini oluştur.
- [ ] `src/components/molecules/ContactInfo.tsx` bileşenini oluştur.

### Aşama 4: Organizma Bileşenlerin Geliştirilmesi (Atomic Design - Organisms)

- [ ] `src/components/organisms/Header.tsx` bileşenini (`Logo`, `NavLink` moleküllerini kullanarak) oluştur. Mobil menü desteği ekle.
- [ ] `src/components/organisms/Footer.tsx` bileşenini oluştur.
- [ ] `src/components/organisms/HeroSection.tsx` bileşenini (`Heading`, `Text`, `Button` atomlarını kullanarak) oluştur.
- [ ] `src/components/organisms/FeaturedProjects.tsx` bileşenini (`ProjectCard` moleküllerini listeleyerek) oluştur.
- [ ] `src/components/organisms/LatestBlogPosts.tsx` bileşenini (`BlogPostCard` moleküllerini listeleyerek) oluştur.
- [ ] `src/components/organisms/AboutSection.tsx` bileşenini oluştur.
- [ ] `src/components/organisms/ProjectList.tsx` bileşenini oluştur.
- [ ] `src/components/organisms/BlogList.tsx` bileşenini oluştur.
- [ ] `src/components/organisms/ContactForm.tsx` bileşenini (opsiyonel, sadece frontend) oluştur.

### Aşama 5: Sayfaların Oluşturulması (`src/app/`)

- [ ] `src/app/layout.tsx` dosyasını, `Header` ve `Footer` organizmalarını içerecek şekilde yapılandır.
- [ ] Ana Sayfa (`/`) için `src/app/page.tsx` dosyasını oluştur ve ilgili organizmaları entegre et (`HeroSection`, `FeaturedProjects`, `LatestBlogPosts`).
- [ ] Hakkımda Sayfası (`/about`) için `src/app/about/page.tsx` dosyasını oluştur ve `AboutSection` organizmasını entegre et.
- [ ] Projeler Sayfası (`/projects`) için `src/app/projects/page.tsx` dosyasını oluştur ve `ProjectList` organizmasını entegre et.
- [ ] Proje Detay Sayfası (`/projects/[slug]/page.tsx`) için dinamik rotayı ve içeriği gösterecek bileşeni oluştur.
- [ ] Blog Sayfası (`/blog`) için `src/app/blog/page.tsx` dosyasını oluştur ve `BlogList` organizmasını entegre et.
- [ ] Blog Yazı Detay Sayfası (`/blog/[slug]/page.tsx`) için dinamik rotayı ve içeriği gösterecek bileşeni oluştur.
- [ ] İletişim Sayfası (`/contact`) için `src/app/contact/page.tsx` dosyasını oluştur ve `ContactForm` organizmasını entegre et.
- [ ] 404 Sayfası (`/404`) için `src/app/not-found.tsx` dosyasını oluştur.

### Aşama 6: İçerik Yönetimi ve Veri Entegrasyonu

- [ ] `src/lib/mdx.ts` içinde MDX dosyalarını okuyacak, parse edecek ve meta verilerini çıkaracak yardımcı fonksiyonları yaz.
- [ ] `src/data/projects/` klasörüne örnek proje `.mdx` dosyaları ekle (`04_site_structure.md`'deki Proje Detay Sayfası yapısına uygun).
- [ ] `src/data/blog/` klasörüne örnek blog `.mdx` dosyaları ekle (`04_site_structure.md`'deki Blog Yazı Detay Sayfası yapısına uygun).
- [ ] Proje ve blog detay sayfalarında MDX içeriğini render etmek için gerekli entegrasyonu yap.

### Aşama 7: Optimizasyon ve Son Dokunuşlar

- [ ] Tüm görselleri optimize et (WebP formatı, uygun boyutlandırma) ve `public/` klasörüne yerleştir.
- [ ] `next/image` bileşenini kullanarak görselleri lazy load et ve optimize et.
- [ ] `03_rules.md`'deki güvenlik prensiplerine (XSS önleme, hassas bilgi yönetimi) tam uyumu kontrol et.
- [ ] `08_ui_ux_guidelines.md`'deki erişilebilirlik (A11y) kurallarına (alt metinler, klavye navigasyonu, kontrast) tam uyumu kontrol et.
- [ ] Performans için Lighthouse denetimi yap ve `02_project_overview.md`'deki hedeflere ulaş.
- [ ] Tüm `console.log` ve `debugger` ifadelerini kaldır.

### Aşama 8: Dağıtım Hazırlığı

- [ ] Projenin `pnpm run build` komutu ile başarılı bir şekilde derlendiğini doğrula.
- [ ] `05_refine_and_deploy.txt` komutunda belirtilen son kontrolleri yap.

```