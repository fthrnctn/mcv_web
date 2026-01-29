# n8n İletişim Formu Workflow Kurulum Rehberi

Bu rehber, MCV web sitesindeki iletişim formunun n8n ile entegrasyonunu açıklar.

---

## 📋 Gereksinimler

- Google Cloud VM üzerinde çalışan n8n instance
- Gmail hesabı: `mcv.international.consultancy@gmail.com`
- Gmail App Password (2FA aktif olmalı)
- Cloudflare Email Routing (info@ ve noreply@ yönlendirmesi)

---

## � E-posta Yapılandırması

### Cloudflare Email Routing Yapısı

| Adres | Yönlendirme |
|-------|-------------|
| `info@mcvconsultancy.com` | → `mcv.international.consultancy@gmail.com` |
| `noreply@mcvconsultancy.com` | → `mcv.international.consultancy@gmail.com` |

### Gmail SMTP Bilgileri

| Ayar | Değer |
|------|-------|
| SMTP Host | `smtp.gmail.com` |
| Port | `465` (SSL) veya `587` (TLS) |
| Kullanıcı | `mcv.international.consultancy@gmail.com` |
| Şifre | Gmail App Password |

---

## 🔐 Adım 0: Gmail App Password Oluşturma

> ⚠️ **Önemli:** Normal Gmail şifrenizi kullanamazsınız. App Password oluşturmanız gerekiyor.

1. [Google Hesap Ayarları](https://myaccount.google.com/) adresine gidin
2. **Güvenlik** → **2 Adımlı Doğrulama** aktif olmalı
3. **Güvenlik** → **App passwords** (Uygulama şifreleri) tıklayın
4. **Select app** → "Mail" seçin
5. **Select device** → "Other (Custom name)" → "n8n" yazın
6. **Generate** tıklayın
7. 16 karakterlik şifreyi **kopyalayın** (bu şifreyi tekrar göremezsiniz!)

---

## 🔧 Adım 1: n8n'de Gmail Credentials Oluşturma

1. n8n'e giriş yapın: `https://n8n.mcvconsultancy.com`
2. Sol menüden **Credentials** → **Add Credential**
3. **Gmail OAuth2** veya **SMTP** seçin

### Seçenek A: SMTP (Önerilen)

| Alan | Değer |
|------|-------|
| **Credential Name** | `MCV Gmail SMTP` |
| **User** | `mcv.international.consultancy@gmail.com` |
| **Password** | `[App Password - 16 karakter]` |
| **Host** | `smtp.gmail.com` |
| **Port** | `465` |
| **SSL/TLS** | `true` |

### Seçenek B: Gmail OAuth2

1. [Google Cloud Console](https://console.cloud.google.com/) adresinde OAuth credentials oluşturun
2. n8n'de OAuth bağlantısını yapın

---

## 🔧 Adım 2: Yeni Workflow Oluşturma

1. Sol menüden **Workflows** → **Create new workflow**
2. Workflow adı: `MCV Contact Form Handler`

---

## 🔗 Adım 3: Node'ları Ekleyin

### Node 1: Webhook (Trigger)

1. **+** butonuna tıklayın
2. **Webhook** seçin
3. Ayarlar:
   - **HTTP Method:** POST
   - **Path:** `contact-form`
   - **Response Mode:** Respond to Webhook
   - **Response Code:** 200

Production URL:
```
https://n8n.mcvconsultancy.com/webhook/contact-form
```

---

### Node 2: Function (Veri İşleme)

1. **+** butonuna tıklayın → **Function** seçin
2. **Language:** JavaScript
3. Kod:

```javascript
// Form verilerini düzenle
const data = items[0].json.body;

// Konu başlıklarını Türkçe'ye çevir
const subjectMap = {
  'genel': 'Genel Bilgi Talebi',
  'ce': 'CE Belgelendirme',
  'iso': 'ISO Danışmanlık',
  'egitim': 'Eğitim Programları',
  'teklif': 'Teklif Talebi',
  'diger': 'Diğer'
};

return [{
  json: {
    name: data.name,
    email: data.email,
    phone: data.phone || 'Belirtilmedi',
    subject: subjectMap[data.subject] || data.subject,
    message: data.message,
    timestamp: data.timestamp,
    source: data.source
  }
}];
```

---

### Node 3: Send Email (Bildirim - Kendinize)

1. **+** butonuna tıklayın → **Send Email** seçin
2. **Credentials:** `MCV Gmail SMTP` seçin
3. Ayarlar:

| Alan | Değer |
|------|-------|
| **From Name** | `MCV Web Sitesi` |
| **From Email** | `mcv.international.consultancy@gmail.com` |
| **To Email** | `mcv.international.consultancy@gmail.com` |
| **Reply-To** | `{{ $json.email }}` |
| **Subject** | `🔔 Yeni İletişim Formu: {{ $json.subject }}` |
| **Email Format** | HTML |

> **Not:** Gmail, From adresi olarak sadece kendi hesabınızı kullanmanıza izin verir. noreply@mcvconsultancy.com kullanamazsınız.

4. **HTML Body:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FF6B00, #FF8C40); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
    .footer { text-align: center; padding: 15px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📬 Yeni İletişim Formu Mesajı</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">👤 Ad Soyad:</div>
        <div class="value">{{ $json.name }}</div>
      </div>
      <div class="field">
        <div class="label">📧 E-posta:</div>
        <div class="value"><a href="mailto:{{ $json.email }}">{{ $json.email }}</a></div>
      </div>
      <div class="field">
        <div class="label">📱 Telefon:</div>
        <div class="value">{{ $json.phone }}</div>
      </div>
      <div class="field">
        <div class="label">📋 Konu:</div>
        <div class="value">{{ $json.subject }}</div>
      </div>
      <div class="field">
        <div class="label">💬 Mesaj:</div>
        <div class="value">{{ $json.message }}</div>
      </div>
    </div>
    <div class="footer">
      Gönderim: {{ $json.timestamp }} | Kaynak: {{ $json.source }}<br>
      <strong>Bu maile yanıt verirseniz müşteriye ulaşırsınız.</strong>
    </div>
  </div>
</body>
</html>
```

---

### Node 4: Send Email (Otomatik Yanıt - Müşteriye)

1. **+** butonuna tıklayın → **Send Email** seçin
2. **Credentials:** `MCV Gmail SMTP` seçin
3. Ayarlar:

| Alan | Değer |
|------|-------|
| **From Name** | `MCV Danışmanlık` |
| **From Email** | `mcv.international.consultancy@gmail.com` |
| **To Email** | `{{ $json.email }}` |
| **Subject** | `MCV Danışmanlık - Mesajınızı Aldık ✓` |
| **Email Format** | HTML |

4. **HTML Body:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FF6B00, #FF8C40); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #eee; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #eee; }
    .btn { display: inline-block; background: #FF6B00; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MCV Danışmanlık</h1>
      <p>Mesajınız Alındı ✓</p>
    </div>
    <div class="content">
      <p>Sayın <strong>{{ $json.name }}</strong>,</p>
      <p>İletişim formumuz aracılığıyla gönderdiğiniz mesaj tarafımıza ulaşmıştır.</p>
      <p>En kısa sürede sizinle iletişime geçeceğiz.</p>
      <p><strong>Mesaj Konusu:</strong> {{ $json.subject }}</p>
      <p>Teşekkür ederiz.</p>
      <p>Saygılarımızla,<br><strong>MCV Danışmanlık Ekibi</strong></p>
      <a href="https://www.mcvconsultancy.com" class="btn">Web Sitemizi Ziyaret Edin</a>
    </div>
    <div class="footer">
      MCV Uluslararası Uygunluk Değerlendirme Danışmanlık<br>
      Ostim OSB, Ankara | +90 533 344 7153<br>
      <a href="mailto:info@mcvconsultancy.com">info@mcvconsultancy.com</a>
    </div>
  </div>
</body>
</html>
```

---

## 🔗 Adım 4: Node Bağlantıları

Workflow şeması:

```
┌──────────┐    ┌──────────┐    ┌─────────────┐    ┌─────────────────┐
│ Webhook  │───▶│ Function │───▶│ Send Email  │───▶│ Send Email      │
│ (Trigger)│    │ (İşleme) │    │ (Bildirim)  │    │ (Otomatik Yanıt)│
└──────────┘    └──────────┘    └─────────────┘    └─────────────────┘
```

**Node'ları bağlamak için:** Bir node'un çıkışından diğer node'un girişine sürükleyin.

---

## ✅ Adım 5: Test ve Aktifleştirme

### 5.1 Webhook'u Test Et
1. Workflow'u **Save** ile kaydedin
2. Webhook node'una tıklayın
3. **Listen for test event** butonuna tıklayın
4. Terminalde test isteği gönderin:

```bash
curl -X POST https://n8n.mcvconsultancy.com/webhook-test/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "name": "Test Kullanıcı",
      "email": "test@example.com",
      "phone": "+90 555 123 4567",
      "subject": "genel",
      "message": "Bu bir test mesajıdır.",
      "timestamp": "2026-01-29T05:00:00Z",
      "source": "mcvconsultancy.com"
    }
  }'
```

### 5.2 Aktifleştir
1. Sağ üstte **Active** toggle'ını açın
2. Workflow artık 7/24 çalışır durumda

---

## 🔒 Adım 6: CORS Ayarları

n8n'in farklı domain'lerden gelen istekleri kabul etmesi için:

### Docker için (.env veya docker-compose.yml):
```env
N8N_ENDPOINT_WEBHOOK=webhook
WEBHOOK_URL=https://n8n.mcvconsultancy.com/
N8N_CORS_ORIGIN=https://www.mcvconsultancy.com,https://mcvconsultancy.com
```

### n8n Cloud için:
CORS ayarları otomatik olarak yapılır.

---

## 🎯 Özet

| Adım | Açıklama |
|------|----------|
| 0 | Gmail App Password oluştur |
| 1 | n8n'de SMTP credential ekle |
| 2 | Yeni workflow oluştur |
| 3 | 4 node ekle (Webhook, Function, 2x Email) |
| 4 | Node'ları bağla |
| 5 | Test et ve aktifleştir |
| 6 | CORS ayarlarını kontrol et |

---

## 🆘 Sorun Giderme

### "Authentication failed" Hatası
- App Password doğru mu kontrol edin
- 2FA aktif mi kontrol edin
- Kullanıcı adı tam e-posta adresi olmalı

### CORS Hatası
- n8n ayarlarında CORS origin ekleyin
- Cloudflare proxy'yi kontrol edin

### Mail Spam'e Düşüyor
- SPF ve DKIM kayıtlarını Cloudflare'de ayarlayın
- Gmail'in gönderici olarak doğrulandığından emin olun

### Webhook Yanıt Vermiyor
- Workflow aktif mi kontrol edin
- n8n loglarını kontrol edin: `docker logs n8n`

---

## 📌 Önemli Notlar

1. **Gmail Limitleri:** Günlük 500 mail (ücretsiz hesap)
2. **From Adresi:** Gmail sadece kendi adresinizi From olarak kabul eder
3. **Reply-To:** Müşteriye yanıt vermek için Reply-To kullanın
4. **Cloudflare:** info@ adresine gelen mailler Gmail'e yönlendirilir

---

*Bu rehber MCV Consultancy web sitesi için oluşturulmuştur.*
*Son güncelleme: 2026-01-29*
