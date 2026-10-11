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
