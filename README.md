# Romantic New Year (Static Site)

Web animasi Tahun Baru dengan tema romantis:
- Countdown menuju 1 Januari tahun depan (waktu lokal)
- Kembang api (canvas)
- Partikel hati melayang
- Ilustrasi sepasang kekasih (SVG) yang bergerak + detak hati

## Ubah nama pasangan (opsional)
Pakai query URL:
`/?a=Rina&b=Andi`

## Jalankan lokal
Bisa langsung buka `index.html`, atau pakai server statis:
- VS Code Live Server
- `python -m http.server 8080`

## Deploy ke GitHub
1. Buat repo baru
2. Upload file: `index.html`, `style.css`, `app.js`, `README.md`
3. Commit & push

## Deploy ke Render (Static Site)
1. Render Dashboard → New → Static Site
2. Connect repo GitHub
3. Settings:
   - Build Command: (kosong) atau `echo "no build"`
   - Publish Directory: `.`
4. Deploy

Dokumentasi Render Static Sites:
https://docs.render.com/static-sites
