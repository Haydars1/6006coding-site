# 6006 Performance — Eksik araç / motor bildirimleri

Bu özellik `/fahrzeug/` sayfasında **“Modelim veya motorum listede yok”** bağlantısını açar.

Kullanıcı kendi bilgilerini (marka, model, yıl, motor kodu, gerekiyorsa orijinal güç/tork, ECU ve not) yerel tarayıcı formuna girebilir. WhatsApp Business ya da e-posta taslağı **yalnızca kullanıcı ilgili bağlantıya bastığında** açılır. Mesajı göndermek ayrıca kullanıcıya bağlıdır. Uygulama kullanıcı bilgilerini veritabanına yazmaz ve tam VIN alanını mesaja eklemez.

## Gelen taleplerin iş akışı

1. Gelen mesajda marka, model, kasa/generation, yıl, yakıt türü, motor kodu ve ECU/yazılım numarasını kontrol et.
2. Eksik ya da şüpheli bilgi için müşteriyle görüş. Özellikle beygir gücü ile PS/HP ve motorun toplam hibrit sistem gücünü birbirinden ayır.
3. Kamuya açık güvenilir kaynak (tercihen üretici) bulunmadan stok motor verisini doğrulanmış teknik bilgi olarak siteye ekleme.
4. Stage 1 ilanında kaynak URL'si, tam motor/generation uyumu, yayımlayan firma ve stok PS/Nm tutarlılığı şartlarını uygula. `docs/stage1-reference-policy.md` içindeki kurallara uy.
5. Siteye eklenecek bilgilerden kişisel verileri, tam VIN'i, plakayı, ad/soyadı ve iletişim detaylarını çıkar. Kullanıcı mesajını herkese açık katalog girdisi yapma.
6. Eklenen düzeltme için site testlerini çalıştır, güncellemeyi GitHub üzerinden gözden geçir ve canlı yayında gerçek model/motor eşleşmesini doğrula.

## Kullanılabilirlik ve güvenlik

- Müşteri **model listesinde olmayan** aracı da kendi marka/model adıyla bildirebilir.
- Yılı veya motor kodunu bilen kullanıcı bir talep hazırlayabilir; ikisi de bilinmiyorsa önce daha fazla bilgi istenir.
- TR / DE / EN arayüzü vardır. iPhone giriş alanlarında 16px metin kullanılır; WhatsApp/e-posta bağlantıları her ekrana sığar.
- Üçüncü taraf ilanlarda belirtilen güç artışları 6006 Performance ölçümü, garantisi veya Almanya TÜV/yasal onayı sayılmaz.
- Bu form müşteriden veriyi otomatik toplamıyor; ayrıca analytics veya izleme çerezi eklemiyor.
