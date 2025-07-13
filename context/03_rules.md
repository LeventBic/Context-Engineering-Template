# Rules

# 03_rules.md

## Genel Davranış Kuralları ve Kısıtlamalar

Bu doküman, Manus AI ajanının proje geliştirme sürecinde uyması gereken tüm genel kuralları, yasakları, güvenlik protokollerini ve en iyi uygulama prensiplerini detaylandırmaktadır. Bu kurallar, projenin kalitesini, güvenliğini, sürdürülebilirliğini ve performansını garanti altına almak için kritik öneme sahiptir.

---

### 1. Temel Prensipler ve Yaklaşım

*   **Bağlam Odaklılık:** Verilen tüm `context` dosyaları (01_persona.md, 02_project_overview.md vb.) en yüksek önceliğe sahiptir. Her karar ve eylem, bu bağlam dosyalarında belirtilen bilgilerle uyumlu olmalıdır.
*   **İteratif Gelişim:** Proje, küçük, yönetilebilir adımlarla ilerlemelidir. Her adımda çıktıların doğruluğu ve kalitesi kontrol edilmelidir.
*   **Şeffaflık:** Yapılan her işlem, alınan her karar ve karşılaşılan her sorun açıkça raporlanmalıdır. Kod yorumları ve dokümantasyon bu şeffaflığı desteklemelidir.
*   **Kullanıcı Merkezlilik:** Tüm tasarım ve geliştirme kararları, `02_project_overview.md` dosyasında tanımlanan hedef kitlenin ihtiyaçları ve `08_ui_ux_guidelines.md` dosyasındaki prensipler doğrultusunda alınmalıdır.

### 2. Kod Kalitesi ve En İyi Uygulamalar

*   **Clean Code Prensibi:**
    *   **Okunabilirlik:** Kod, sanki bir hikaye anlatıyormuş gibi okunabilir olmalıdır. Değişken, fonksiyon, sınıf ve bileşen isimleri, amaçlarını ve işlevlerini net bir şekilde yansıtmalıdır (örn: `calculateTotal`, `UserProfileCard`). Kısaltmalardan ve belirsiz isimlerden kaçınılmalıdır.
    *   **Basitlik:** Karmaşık algoritmalar veya iş mantıkları, daha küçük, anlaşılır ve test edilebilir parçalara ayrılmalıdır.
    *   **Yorumlar:** Kodun neden yazıldığına dair karmaşık iş mantığını veya kritik kararları açıklayan yorumlar eklenmelidir. Ancak, iyi yazılmış kodun kendini açıklayacağı unutulmamalıdır; gereksiz yorumlardan kaçınılmalıdır.
    *   **Biçimlendirme:** `05_tech_stack.md` dosyasında belirtilen linting ve formatting araçlarının (ESLint, Prettier) kurallarına harfiyen uyulmalıdır. Tutarlı girintileme, boşluk kullanımı ve satır sonları sağlanmalıdır.
*   **Tek Sorumluluk Prensibi (Single Responsibility Principle - SRP):** Her fonksiyon, sınıf veya bileşen sadece tek bir sorumluluğa sahip olmalıdır. Bu, kodun daha modüler, test edilebilir ve bakımı kolay olmasını sağlar.
*   **DRY Prensibi (Don't Repeat Yourself):** Kod tekrarından kaçınılmalıdır. Ortak kullanılan mantıklar veya UI elementleri yeniden kullanılabilir bileşenler veya yardımcı fonksiyonlar olarak soyutlanmalıdır.
*   **Modülerlik:** Kod, bağımsız ve yeniden kullanılabilir modüllere ayrılmalıdır. Bu, projenin ölçeklenebilirliğini artırır.
*   **Hata Yönetimi:** Potansiyel hata durumları öngörülmeli ve uygun hata yakalama (try-catch) mekanizmaları ile kullanıcıya dostu hata mesajları sunulmalıdır. Sunucu tarafı hataları veya API çağrısı hataları uygun şekilde ele alınmalıdır.
*   **Performans Optimizasyonu:** `02_project_overview.md` dosyasındaki performans hedeflerine ulaşmak için kod yazımında ve kaynak kullanımında optimizasyonlar yapılmalıdır (örn: gereksiz render'lardan kaçınma, büyük listeler için sanallaştırma, resim optimizasyonu).

### 3. Güvenlik Protokolleri ve Yasaklar

*   **Hassas Bilgi Yönetimi:**
    *   API anahtarları, veritabanı kimlik bilgileri, özel anahtarlar gibi hassas bilgiler asla doğrudan frontend koduna gömülmemelidir. Bunlar her zaman ortam değişkenleri (environment variables) aracılığıyla veya güvenli bir backend servisi üzerinden yönetilmelidir.
    *   Kullanıcı parolaları veya diğer hassas kişisel veriler (varsa) asla düz metin olarak saklanmamalı veya iletilmemelidir. Güvenli şifreleme ve hashing algoritmaları kullanılmalıdır.
*   **Girdi Doğrulama ve Temizleme (Input Validation & Sanitization):**
    *   Kullanıcıdan alınan tüm girdiler (form alanları, URL parametreleri vb.) sunucuya gönderilmeden önce ve sunucu tarafında mutlaka doğrulanmalı ve temizlenmelidir. Bu, Cross-Site Scripting (XSS) ve SQL Injection gibi saldırıları önlemek için kritik öneme sahiptir.
    *   Asla `dangerouslySetInnerHTML` (React) veya benzeri direkt HTML enjeksiyonu sağlayan yöntemler kullanılmamalıdır. Kullanıcı tarafından sağlanan içerik, güvenli bir şekilde render edilmelidir (örn: Markdown içeriği için güvenli bir kütüphane kullanmak).
*   **Cross-Site Scripting (XSS) Önleme:**
    *   Kullanıcı tarafından sağlanan veriler DOM'a eklenmeden önce her zaman kaçış (escaping) veya sanitizasyon işleminden geçirilmelidir.
    *   `eval()` fonksiyonu veya dinamik kod çalıştırma yöntemlerinden kaçınılmalıdır.
*   **Cross-Site Request Forgery (CSRF) Önleme:**
    *   Form gönderimleri veya durum değiştiren istekler için CSRF tokenları kullanılmalıdır (eğer bir backend entegrasyonu varsa).
*   **Bağımlılık Güvenliği:** Kullanılan tüm üçüncü taraf kütüphaneler ve bağımlılıklar düzenli olarak güvenlik açıkları için taranmalı ve güncel tutulmalıdır. Bilinen zafiyetleri olan bağımlılıklar kullanılmamalıdır.
*   **Yetkilendirme ve Kimlik Doğrulama (Authentication & Authorization):** (Eğer siteye bir admin paneli veya kullanıcı girişi eklenirse geçerlidir)
    *   Kimlik doğrulama için güvenli ve standart protokoller (örn: OAuth2, JWT) kullanılmalıdır.
    *   Yetkilendirme kontrolleri hem frontend hem de backend tarafında yapılmalıdır. Kullanıcıların sadece yetkili oldukları kaynaklara erişebildiğinden emin olunmalıdır.

### 4. Yasaklar (Kesinlikle Yapılmaması Gerekenler)

*   **Placeholder Metinler:** Asla `Lorem Ipsum`veya "Test" gibi yer tutucu metinler kullanılmamalıdır. Her zaman proje bağlamına uygun, gerçekçi ve anlamlı içerikler üretilmelidir.
Kırık Linkler ve Görseller: Sitede hiçbir kırık link veya yüklenemeyen görsel bulunmamalıdır. Tüm bağlantılar ve kaynaklar test edilmelidir.
console.log, alert vb. Debug İfadeleri: Nihai (production) kodda asla console.log, alert, debugger gibi debug ifadeleri bırakılmamalıdır.
!important Kullanımı: CSS'te !important kullanmaktan kaçınılmalıdır. Bu, genellikle kötü yazılmış veya anlaşılamayan CSS'in bir işaretidir. CSS özgüllüğü (specificity) kuralları doğru bir şekilde kullanılmalıdır.
Büyük ve Optimize Edilmemiş Kaynaklar: Büyük resim dosyaları, videolar veya optimize edilmemiş JavaScript/CSS dosyaları kullanılmamalıdır. Tüm kaynaklar, performansı en üst düzeye çıkarmak için sıkıştırılmalı ve optimize edilmelidir.
"Sihirli Sayılar" ve "Sihirli Dizeler" (Magic Numbers & Magic Strings): Kod içinde doğrudan sayısal veya metinsel değerler kullanmaktan kaçınılmalıdır. Bu tür değerler, anlamlı isimlere sahip sabitler (constants) olarak tanımlanmalıdır. Bu, kodun okunabilirliğini ve bakımını kolaylaştırır.
Teknoloji Kısıtlamalarını İhlal Etme: 05_tech_stack.md dosyasında belirtilen teknoloji yığınının dışına çıkılmamalıdır. Yeni bir kütüphane veya araç eklemek için kullanıcıdan onay alınmalıdır.
Erişilebilirlik Standartlarını Göz Ardı Etme: 08_ui_ux_guidelines.md dosyasında belirtilen erişilebilirlik kuralları asla ihlal edilmemelidir.
Bu kurallar, projenin başarısı için bir sözleşme niteliğindedir. Manus AI, bu kurallara tam uyum sağlamayı taahhüt eder.