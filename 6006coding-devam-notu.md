# 6006 Performance — proje devri

Bu ZIP, 9 Ekim 2026'da kontrol edilen statik sitenin HTML/CSS/JavaScript kaynaklarını, görsellerini ve kod verilerini içerir. Önceki sohbet veya çalışma klasörü gerekli değildir.

## Proje bilgileri

- Sites projesi: `appgprj_6ac3ec88e9348191b91bdadf8e6c8c41`
- Site: https://6006coding.de
- Sites adresi: https://coding-6006.haydarozer.chatgpt.site
- Kontrol anındaki sürüm: 28
- Kaynak commit: `bcb32356d3ed5717dd1a8c93e1a82fcac1ae8015`
- Yayın dizini: `dist/`
- `.openai/hosting.json` aynı Sites projesine bağlıdır.

Bu pakette erişim anahtarı yoktur. Paket dosyaları düzenlemeye yarar; yayınlamak için Sites araçları ve hesap yetkisi gerekir. Canlı proje bu yedekten sonra güncellenmişse en yeni kaynakları aç; eski dosyaları yeni sürümün üzerine topluca yazma.

## Yeni sohbete gönderilecek mesaj

```text
6006coding.de sitemi geliştirmeye devam et. Eski sohbeti veya eski /workspace klasörünü aramana gerek yok. Eklediğim ZIP'te kaynak dosyaları var; onu aç ve bu devam notunu oku.

Mevcut Sites proje kimliği: appgprj_6ac3ec88e9348191b91bdadf8e6c8c41

Sites kaynak araçların varsa önce get_site ile son sürümü kontrol et ve sites-hosting becerisinin “Open a Site” akışını uygula. Eski klasör bulunmazsa mevcut kaynak deposunu yeni, boş klasöre geri yükle. create_source_repository_write_credential varsa projenin gerçek kaynak deposunu bununla aç; tokenları bana gösterme veya dosyaya kaydetme.

Kaynak deposu elde edilemiyorsa en güncel yayınlanan Sites sürümünün archive_storage.sediment_file_id arşivini indir. Bu proje buildless statik HTML/CSS/JS olduğundan dist dosyaları düzenlenebilir kaynaklardır. Bunlar kullanılamıyorsa eklediğim ZIP üzerinden çalış.

GitHub'daki farklı bir deponun salt okunur olması nedeniyle durma; Sites'in kendi kaynağını kontrol et. Yeni site oluşturma. Mevcut projeyi, turbo amblemini, tasarımı ve çalışan özellikleri koruyarak değişiklik yap. Rehberler sitede okunmalı; bilgi arayan kişileri WhatsApp'a yönlendirme. Kesin yağ/parça/tork bilgilerini doğrulanmış araç ve motor kaynaklarıyla ekle.

Değişiklikleri uygula ve test et. Sites yazma/yayın araçların varsa aynı projeye yayınla. Yayın erişimin yoksa düzenlenmiş kaynakları ZIP olarak ver ve erişim sınırını açıkça söyle. Sadece “eski sohbet veya klasör bulunamadı” diyerek durma. Erişmeden veya yayınlamadan bunları yaptığını söyleme.
```

## Kaynaklar

- `dist/index.html`: Ana sayfa, Stage 1, hizmetler, danışman.
- `dist/reparatur-wartung/index.html`: Araç seçimi ve bakım/tamir rehberleri.
- `dist/fahrzeug/index.html`: Seçilen araç; bakım, tamir, arıza, teknik veri sekmeleri.
- `dist/fehlercodes/index.html`: Arıza kodu arama ve detaylar.
- `dist/technik/index.html`: Teknik içerik.
- `dist/assets/6006-dtc-catalog.json`: 18.805 kod tanımı; kaynak atfı sitede.
- `dist/assets/6006-dtc-catalog.js`: Kod arama, filtre ve detaylar.
- `dist/assets/6006-ui.js` ve `.css`: Ortak arayüz.
- `dist/assets/6006-language-bridge.js`: Mobil menü.
- `dist/assets/realparts/`: Parça ve sistem görselleri.

Marka 6006 Performance. Premium, sakin tasarım; koyu grafit, sıcak altın, kırmızı, beyaz. Mevcut turbo amblemini ve telefon diline geçişi koru. Alman müşteriler için Almanca içerik önemli. WhatsApp +49 178 8354756; e-posta 6006performance@gmail.com.

Araç listesi 40'tan fazla marka ve elle giriş seçeneği içerir. Her model için doğrulanmış OEM yağ, parça, tork ve bakım verileri henüz tamamlanmış değildir. Sadece aracın adını seçmek rehberdeki değerlerin o araç için doğrulandığı anlamına gelmez. Kaynaksız verileri veya ölçülmemiş Stage 1 değerlerini kesin sonuç olarak sunma.

## Yerel kontrol

`python3 -m http.server 4174 --directory dist` ile aç, http://localhost:4174 üzerinden kontrol et. Araç seçimi, katalog sekmeleri, kod arama, mobil menü, görseller ve bağlantıları test et.
