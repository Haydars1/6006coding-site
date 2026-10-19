# 6006 Performance — Kaynak ve otomatik yayın

Bu depo **6006coding.de** için ayrı statik site kaynağıdır. JARVIS projesiyle bağlantısı yoktur.

- **Kaynak sayfalar:** `dist/`
- **Arıza kataloğu:** `dist/assets/6006-dtc-catalog.json` (18.805 tanım)
- **Etkileşimli parça görselleri:** `dist/assets/realparts/` (17 sistem)
- **Test:** `npm test`
- **Render build command:** `npm run build`
- **Render publish directory:** `dist`
- **Render auto-deploy:** `main` dalındaki her güncelleme

11 Ekim 2026 kontrolünde `6006coding.de` HTTP yanıtı Render/CDN üzerinden gelmektedir. GitHub test başarısı ile canlı yayın ayrı kontrol edilmelidir. DNS değişikliği bu geliştirme için gerekli değildir.

## Otomatik sayfalarda kalite kontrolü

Build, 86 ayrıntılı rehber ve 12.042 otomatik kod referansı üretir. Bu iki sayı ayrı raporlanır; referanslar OEM tarafından doğrulanmış onarım talimatı sayılmaz. Üretici açıklamaları ayrı ilk kontrol alanları içerir. Tamamlanmamış OBD testleri parça arızası olarak sunulmaz; SRS ve yüksek voltaj kayıtlarında genel elektrik testleri önerilmez.

Hizmet sunumu motor yazılımı incelemesi, araç kodlama, konfor işlevleri ve arıza teşhisini anlatır. Güç artışı hesaplayıcısı ve üçüncü taraf karşılaştırma kataloğu yayından kaldırılmıştır. Araç seçimi, orijinal teknik referanslar ve bakım/arıza rehberleri korunur. Eski karşılaştırma bağlantısı `prepare-services-release.mjs` ile `noindex` bir yönlendirme sayfasına dönüşür; tarayıcı yeni hizmet bölümünü açar. Arşivlenen üçüncü taraf verileri `docs/archive/` altındadır ve `dist/` içine yayınlanmaz.

Yalnızca boş/ayrılmış tanımı bulunan kod sayfaları erişilebilir kalır, `noindex,follow` ile sitemap dışında tutulur. `lastmod` build tarihinden türetilmez. `verify-generated.mjs` tüm sitemap ve kod sayfalarını; canonical, tek H1, JSON-LD, yerel bağlantı, dosya ve fragment hedefleri açısından kontrol eder. Google indeksleme, sıralama ve AdSense geliri bu testlerle doğrulanamaz.

## Bir defalık kurulum

1. GitHub hesabında ayrı bir depo oluştur: `6006coding-site`.
2. Bu dizinin içeriğini GitHub depo köküne ekle.
3. Render -> New -> Static Site -> depoyu bağla.
4. Dal `main`, build `npm run build`, publish `dist`, auto-deploy açık.
5. Yeni `.onrender.com` adresini kontrol ettikten sonra Render'ın verdiği DNS değerleriyle `6006coding.de` alan adını bağla.

## İçerik kalitesi

Araç katalog sayfaları marka/motor seçimi yaptı diye OEM bakım, parça veya sıkma torku değerleri doğrulanmış kabul edilmez. Kesin rakamlar için araç/motor kaynağı gereklidir. Arıza parçaları temsili çizimlerdir, OEM teknik şemalar değildir.
