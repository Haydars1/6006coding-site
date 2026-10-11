# 6006 Performance — Stage 1 referans veri politikası

Bu katalog **üçüncü tarafların açıkça yayımladığı örnekleri** gösterir; 6006 Performance'ın yaptığı dyno ölçümü, satılabilir hazır ECU yazılımı, Almanya için TÜV/onay veya garanti olduğunu söylemez.

Canlı veri: `dist/assets/6006-stage1-references.json`. Her satır kaynak adresi, sağlayıcı, baz değerler, ilan edilmiş sonuçlar, model-yıl ve motor koşulları ile eklenir.

## Yeni kayıt ekleme kontrolü

1. Motor adı, yakıt ve yıl aralığı yayımlayan kaynakta açıkça bulunmalı.
2. Kaynaktaki orijinal ve tuning değerleri ayrı ayrı yazılmalı; birim PS / Nm açık olmalı, fiyat veya müşteri sözü kullanılmamalı.
3. Araç veritabanındaki stok motor kodu, nesil ve HP/Nm doğrulanamıyorsa kaynak sonucu otomatik gösterilmemeli. Yalnızca müşterinin doğruladığı motor kodu ve stok değerlerine dayanan `manualOnly` kayıtları kullanılabilir.
4. Her kayıt `classification: "third-party-advertised"` olarak kalmalı, kaynak URL'si HTTPS olmalı. Kayıt, 6006'in kendi garantili sonucu olarak gösterilmemeli.
5. Stok PS/Nm veya nesil eşleşmezse sitede değer gösterilmemeli. ECU/TCU dosya sürümü, araç kondisyonu ve Almanya'da yasal kullanım ayrıca kontrol edilir.
6. Yayımlayan üçüncü taraf kaynağın sayfası değişirse kaydı yeniden denetle; kaldırılması gerekiyorsa dosyadan kaldırıp testleri çalıştır.

**Önemli:** 30 binden fazla açık motor satırı vardır, fakat bu satırlar OEM tarafından onaylanmış güç veya tuning sonucu değildir. Sistem tüm motorlara aynı yüzdelik Stage 1 artışı uygulamaz.

## Örnek veri alanları

`id, classification, make, model, yearFrom, yearTo, fuel, enginePrefix, generationContains, sourceStockHp, sourceStockNm, publishedStockPs, publishedStockNm, publishedStage1Ps, publishedStage1Nm, publisher, sourceUrl`

`manualOnly` türünde `manualEngineContains` zorunludur, kullanıcıdan motor kodu ve stok güç/tork değerleri beklenir. Veriler ziyaretçi aksiyonu olmadan dış servise aktarılmaz.

İşletmeye ait doğrulanmış dyno kayıtları daha sonra **ayrı bir veri türü** ve kaynak/sahip onayıyla yönetilmelidir; bunları üçüncü taraf örneklerinin içine karıştırmayın.

## 12 Ekim 2026 genişletmesi

**12 ayrı kaynaklı ilan örneği / 9 marka:** BMW, Volkswagen, Audi, Renault, Opel, SEAT, Škoda, Peugeot ve Mercedes-Benz.

Katalog kaynağı bir otomobil markasının bütün motorlarını temsil etmez. Doğrudan eşleştirme yalnızca jenerasyon, stok motor HP/Nm, yakıt türü, üretim yılı ve motor etiketinin tümü uyuşursa açılır. Referans motor modeli katalogda bulunamıyorsa `manualOnly` girilerek motor adı + stok PS/Nm + yıl + yakıt ayrı doğrulanmalıdır. Üçüncü taraf ilanları bağımsız olarak güncellenebilir ve bu değerler 6006 Performance'ın ölçümü değildir.

Manuel örneklerin bir kısmında kaynakta motor/ECU yazılım numarası olmadığından doğrudan ECU/harita uyumluluğu çıkarılamaz. Araç sağlığı, emisyon ve yol uygunluğu ayrı kontrol edilmeden kullanıcıya kesin sonuç veya Almanya'da izin garantisi verilmez.

## 12 Ekim 2026 — Kaynak denetimi ve 21 örnek

Artık kaynaklar **21 ilandan / 12 markadan** oluşmaktadır. Yeni doğrudan kaynaklar Audi A3 8V/8Y, Nissan Qashqai J11, Hyundai i30 1.0/1.4 T-GDI, Ford Focus Mk3/Mk4 1.0 EcoBoost, Peugeot 208 II 1.2 PureTech ve BMW 3 Serisi Gran Turismo F34 320d motorlarını kapsar. Bunlar gerçek ECU haritası değil, üçüncü tarafın ilan ettiği değerlerdir. Kaynak URL'leri doğrudan ilgili motor ilanlarını açmalıdır.

**BMW kontrolü:** Genel 3 Serisi (F3x) ile 3 Serisi Gran Turismo (F34) ayrı model kabul edilir. Gran Turismo (F34) kaynağını genel 3 Serisi arama sonucuna sessizce uygulamayın. Katalogda nesil ve gövde tipi başka model olarak sınıflanıyorsa eşleşme reddedilir. Motor gücü katalog etiketine uymuyorsa referans gösterilmez.

**Yeni markalarda:** Ford Focus motor verisinde açık katalog ile ilan arasında 1 Nm fark bulunduğundan yalnızca model yılı, motor adı ve kullanıcı tarafından doğrulanan 125 PS / 170 Nm bilgileriyle örnek açılır. Audi A3 8Y için de katalogdaki 360 Nm ile ilan edilen 340 Nm karıştırılmaz; manuel doğrulama gereklidir.
