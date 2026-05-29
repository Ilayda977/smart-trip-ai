#  SmartTrip AI — Yapay Zeka Destekli Akıllı Seyahat Asistanı

SmartTrip AI; seyahat planlarını bütçe, tempo, seyahat modu ve konaklama süresi gibi tamamen kişiselleştirilmiş parametrelere göre şekillendiren, tarayıcı tabanlı çalışan yenilikçi bir web uygulamasıdır. Herhangi bir backend bağımlılığı olmadan, doğrudan istemci tarafında (client-side) LLM entegrasyonu ve dinamik veri yönetimi sunar.

  **[SmartTrip AI Canlı Uygulamasını Deneyin](https://smart-trip-ai-lovat.vercel.app/)** |  **Vite + React + TypeScript**

---

##  Öne Çıkan Gelişmiş Özellikler

-  **Kararlı Yapay Zeka Çıktıları (Structured Outputs):** Gemini 2.5 Flash modeline katı bir JSON şeması (`responseSchema`) dikte edilerek modelin her zaman %100 kararlı ve arayüze tam uyumlu veri üretmesi sağlandı.
-  **Dinamik Dark Mode Geçişi:** Sağ üst köşede yer alan tema butonuyla anlık geçiş imkanı. Sadece arka planı karartmakla kalmaz, pastel gradyanlı seyahat kartlarının tonlarını da gözü yormayacak şekilde optimize eder.
-  **Gelişmiş Bütçe Takibi:** AI tarafından üretilen tahmini maliyetleri (`estimatedCost`) gün bazında ve seyahat özeti olarak anlık hesaplayan dinamik bütçe hesaplama motoru.
-  **Open-Meteo API Entegrasyonu:** Herhangi bir API key gerektirmeyen ücretsiz servis ile seyahat tarihine göre anlık sıcaklık ve durum takibi. Yağmurlu günlerde otomatik olarak kırmızı bir `İç mekan öner!` uyarısı tetiklenir.
-  **Aktivite Değiştirme (Regenerate):** Rota üzerinde beğenilmeyen tek bir aktivite olduğunda, diğer günlerin akışını bozmadan sadece o karta özel Gemini üzerinden anlık alternatif konum üretme yeteneği.
- ↕ **Sürükle-Bırak (Drag and Drop):** Aynı gün içerisindeki aktivitelerin sıralamasını mouse ile tutup sürükleyerek anında değiştirebilme konforu.
-  **Rota Paylaşma (Export):** "Dışa Aktar" butonu yardımıyla tüm seyahat planını yerel ipuçları ve bütçe özetleriyle birlikte `.txt` dosyası olarak bilgisayara indirebilme.
-  **Skeleton Loading &  Konfeti Animasyonu:** Sayfa yüklenirken gözü yoran spinner'lar yerine şık placeholder kart animasyonları parlar. Rota üzerindeki tüm yerler gezilip ilerleme çubuğu %100 yapıldığında ise ekranda canvas konfetileri patlar.

---

## Kullanılan Teknolojiler ve Servisler

- **Frontend:** React 18, TypeScript, Vite
- **Stil ve Animasyon:** Tailwind CSS, Canvas Confetti
- **Yapay Zeka:** `@google/generative-ai` (Gemini 2.5 Flash)
- **Harici API'ler:** Open-Meteo API (Hava Durumu), Unsplash (Statik Akıllı Şehir Görselleri)
