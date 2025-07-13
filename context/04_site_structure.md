# Site Structure

# 04_site_structure.md

## Web Sitesi Sayfa Yapısı ve Hiyerarşisi

Bu doküman, AI Researcher Portfolio web sitesinin tüm sayfalarını, bu sayfaların URL yapılarını, ana bölümlerini ve her bir bölümün temel içeriğini detaylandırmaktadır. Bu yapı, sitenin navigasyonunu, kullanıcı deneyimini ve içerik organizasyonunu belirleyecektir.

---

### 1. Ana Sayfa (`/`)

*   **URL:** `/` (Kök dizin)
*   **Amacı:** Ziyaretçilere Dr. Elif Yılmaz hakkında hızlı bir genel bakış sunmak, en önemli çalışmalarını öne çıkarmak ve onları sitenin diğer bölümlerini keşfetmeye teşvik etmek.
*   **Bölümler:**
    *   **1.1. Hero Bölümü (Kahraman Alanı):**
        *   **İçerik:** Büyük, etkileyici bir başlık (örn: "Yapay Zekanın Sınırlarını Keşfetmek: Dr. Elif Yılmaz'ın Araştırmaları"), Dr. Elif Yılmaz'ın adı ve unvanı (örn: "Yapay Zeka Araştırmacısı"), kısa ve çarpıcı bir biyografi özeti.
        *   **Görsel:** Dr. Yılmaz'ın profesyonel bir portre fotoğrafı veya soyut bir AI temalı illüstrasyon.
        *   **CTA (Call-to-Action):** "Projeleri Keşfet" veya "Hakkımda Daha Fazla Bilgi Edinin" gibi yönlendirici butonlar.
    *   **1.2. Öne Çıkan Projeler Bölümü:**
        *   **İçerik:** Dr. Yılmaz'ın en etkili veya güncel 3 projesinin kısa tanıtımları. Her proje için bir kart (card) kullanılmalı.
        *   **Proje Kartı Yapısı:** Proje başlığı, kısa açıklama (1-2 cümle), kullanılan anahtar teknolojiler (etiketler halinde), ve "Detayları Gör" linki (`/projects/[proje-slug]` adresine yönlendirmeli).
    *   **1.3. Son Yayınlar/Blog Yazıları Bölümü:**
        *   **İçerik:** En son yayınlanmış 2-3 akademik makale veya blog yazısının başlıkları ve kısa özetleri. Her birine ait "Yazıyı Oku" linki (`/blog/[yazi-slug]` adresine yönlendirmeli).
    *   **1.4. İletişim Önizleme Bölümü:**
        *   **İçerik:** Kısa bir iletişim mesajı (örn: "İşbirliği veya danışmanlık fırsatları için benimle iletişime geçin.") ve "İletişim" sayfasına yönlendiren bir buton.

### 2. Hakkımda Sayfası (`/about`)

*   **URL:** `/about`
*   **Amacı:** Dr. Elif Yılmaz'ın akademik geçmişini, araştırma felsefesini, ilgi alanlarını ve kişisel yolculuğunu detaylı bir şekilde sunmak.
*   **Bölümler:**
    *   **2.1. Detaylı Biyografi:**
        *   **İçerik:** Dr. Yılmaz'ın eğitim geçmişi, kariyer dönüm noktaları, araştırma felsefesi ve yapay zeka alanına olan tutkusunu anlatan kapsamlı bir metin.
    *   **2.2. Araştırma İlgi Alanları:**
        *   **İçerik:** Dr. Yılmaz'ın uzmanlaştığı ve ilgi duyduğu spesifik yapay zeka alt alanlarının (örn: Pekiştirmeli Öğrenme, Doğal Dil İşleme, Bilgisayar Görüsü, Etik AI) listesi. Her bir alan için kısa bir açıklama yapılabilir.
    *   **2.3. Akademik Yayınlar:**
        *   **İçerik:** Tüm akademik yayınların (dergi makaleleri, konferans bildirileri, kitap bölümleri) kronolojik veya tematik olarak listesi. Her bir yayın için başlık, yazarlar, yayınlandığı yer, yıl ve varsa DOI veya PDF linki bulunmalı.
    *   **2.4. CV İndirme:**
        *   **İçerik:** Güncel CV'nin PDF formatında indirilebileceği bir buton veya link.

### 3. Projeler Sayfası (`/projects`)

*   **URL:** `/projects`
*   **Amacı:** Dr. Yılmaz'ın tüm araştırma ve geliştirme projelerini sergilemek, her bir projenin detaylarına kolay erişim sağlamak.
*   **Bölümler:**
    *   **3.1. Proje Listesi/Galerisi:**
        *   **İçerik:** Tüm projelerin kartlar halinde sunulduğu bir galeri. Her kartta proje başlığı, kısa açıklama, anahtar teknolojiler ve bir görsel (varsa) bulunmalı.
        *   **Filtreleme/Sıralama:** Projeleri kategoriye (örn: NLP, Computer Vision), kullanılan teknolojiye veya yıla göre filtreleme/sıralama seçenekleri sunulabilir.
    *   **3.2. Proje Detay Sayfası (`/projects/[proje-slug]`)**
        *   **URL:** `/projects/[proje-slug]` (Dinamik URL, `[proje-slug]` projenin benzersiz tanımlayıcısıdır.)
        *   **Amacı:** Her bir projenin derinlemesine detaylarını, metodolojisini, sonuçlarını ve öğrenilen dersleri sunmak.
        *   **Bölümler:**
            *   **Başlık ve Tarih:** Projenin tam adı ve tamamlanma tarihi.
            *   **Genel Bakış:** Projenin amacı, problemi ve ana hedefleri.
            *   **Metodoloji:** Kullanılan araştırma yöntemleri, algoritmalar ve yaklaşımlar.
            *   **Teknolojiler:** Projede kullanılan programlama dilleri, kütüphaneler, frameworkler ve araçlar.
            *   **Sonuçlar ve Bulgular:** Projenin elde ettiği ana sonuçlar, başarılar ve katkılar. Görselleştirmeler (grafikler, tablolar) ile desteklenebilir.
            *   **Öğrenilen Dersler ve Gelecek Çalışmalar:** Proje sırasında karşılaşılan zorluklar ve bunların nasıl aşıldığı, projenin gelecekteki potansiyel yönleri.
            *   **Görseller/Demolar:** Projeye ait ekran görüntüleri, akış şemaları, video demoları veya interaktif prototipler.
            *   **Kaynaklar:** Varsa, ilgili akademik yayınlara, GitHub reposuna veya canlı demoya linkler.

### 4. Blog/Yayınlar Sayfası (`/blog`)

*   **URL:** `/blog`
*   **Amacı:** Dr. Yılmaz'ın güncel düşüncelerini, araştırma güncellemelerini, sektörel analizlerini ve kişisel görüşlerini paylaştığı bir platform sunmak.
*   **Bölümler:**
    *   **4.1. Yazı Listesi:**
        *   **İçerik:** Tüm blog yazılarının veya makalelerin, en yeniden en eskiye doğru sıralandığı bir liste. Her liste öğesi için başlık, kısa özet, yayın tarihi ve yazar (Dr. Elif Yılmaz) bilgisi bulunmalı.
        *   **Kategorizasyon/Etiketleme:** Yazıları konularına göre filtreleme veya etiketleme seçenekleri sunulabilir.
    *   **4.2. Yazı Detay Sayfası (`/blog/[yazi-slug]`)**
        *   **URL:** `/blog/[yazi-slug]` (Dinamik URL, `[yazi-slug]` yazının benzersiz tanımlayıcısıdır.)
        *   **Amacı:** Seçilen blog yazısının veya makalenin tam metnini sunmak.
        *   **Bölümler:**
            *   **Başlık, Yazar ve Tarih:** Yazının tam başlığı, yazarın adı ve yayın tarihi.
            *   **Yazı Metni:** Yazının tam içeriği, Markdown formatında biçimlendirilmiş (başlıklar, paragraflar, listeler, kod blokları, görseller).
            *   **İlgili Yazılar:** Okuyucunun ilgisini çekebilecek benzer konulardaki diğer yazılara linkler.

### 5. İletişim Sayfası (`/contact`)

*   **URL:** `/contact`
*   **Amacı:** Potansiyel işbirlikçilerin, öğrencilerin veya medya mensuplarının Dr. Yılmaz ile kolayca iletişime geçmesini sağlamak.
*   **Bölümler:**
    *   **5.1. İletişim Bilgileri:**
        *   **İçerik:** Dr. Yılmaz'ın profesyonel e-posta adresi.
    *   **5.2. Sosyal ve Akademik Profil Linkleri:**
        *   **İçerik:** LinkedIn, Google Scholar, ResearchGate, GitHub, Twitter gibi profesyonel ve akademik profillere yönlendiren ikonlar ve linkler.
    *   **5.3. İletişim Formu (Opsiyonel):**
        *   **İçerik:** Ad, E-posta, Konu ve Mesaj alanlarını içeren basit bir iletişim formu. Form gönderimi sonrası bir onay mesajı gösterilmeli. (Bu formun backend entegrasyonu şu an için kapsam dışıdır, sadece frontend tasarımı yapılacaktır.)

### 6. 404 Sayfası (`/404`)

*   **URL:** `/404`
*   **Amacı:** Kullanıcının var olmayan bir sayfaya erişmeye çalıştığında bilgilendirici ve kullanıcı dostu bir hata mesajı sunmak.
*   **Bölümler:**
    *   **6.1. Hata Mesajı:** "Üzgünüz, aradığınız sayfa bulunamadı." gibi bir mesaj.
    *   **6.2. Yönlendirme:** Ana sayfaya veya projeler sayfasına geri dönmek için bir link veya buton.

Bu detaylı sayfa yapısı, Manus AI'ın sitenin her bir bölümünü ve içeriğini tutarlı bir şekilde inşa etmesi için net bir yol haritası sunmaktadır.