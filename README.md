# 6006 Performance — Kaynak ve otomatik yayın

Bu depo **6006coding.de** için ayrı statik site kaynağıdır. JARVIS projesiyle bağlantısı yoktur.

- **Kaynak sayfalar:** `dist/`
- **Arıza kataloğu:** `dist/assets/6006-dtc-catalog.json` (18.805 tanım)
- **Etkileşimli parça görselleri:** `dist/assets/realparts/` (17 sistem)
- **Test:** `npm test`
- **Render build command:** `npm run build`
- **Render publish directory:** `dist`
- **Render auto-deploy:** `main` dalındaki her güncelleme

> `6006coding.de` hâlen ChatGPT Sites üzerindedir. Yeni Render adresindeki sayfalar, logo, telefon dili, arama, marka kataloğu, WhatsApp ve e-posta bağlantıları doğrulanmadan DNS kayıtlarını değiştirmeyin. E-posta MX ve TXT kayıtlarını koruyun.

## Bir defalık kurulum

1. GitHub hesabında ayrı bir depo oluştur: `6006coding-site`.
2. Bu dizinin içeriğini GitHub depo köküne ekle.
3. Render -> New -> Static Site -> depoyu bağla.
4. Dal `main`, build `npm run build`, publish `dist`, auto-deploy açık.
5. Yeni `.onrender.com` adresini kontrol ettikten sonra Render'ın verdiği DNS değerleriyle `6006coding.de` alan adını bağla.

## İçerik kalitesi

Araç katalog sayfaları marka/motor seçimi yaptı diye OEM bakım, parça veya sıkma torku değerleri doğrulanmış kabul edilmez. Kesin rakamlar için araç/motor kaynağı gereklidir. Arıza parçaları temsili çizimlerdir, OEM teknik şemalar değildir.
