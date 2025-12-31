# New Year Animation (Static Site)

Web animasi tema tahun baru: countdown menuju 1 Jan tahun depan + animasi kembang api (canvas).

## Jalankan lokal
Cukup buka `index.html` langsung, atau pakai server statis:

- VS Code Live Server, atau
- `python -m http.server 8080`

## Deploy ke Render (Static Site)
1. Push project ini ke GitHub.
2. Di Render: **New** → **Static Site**.
3. Connect repo GitHub kamu.
4. Settings:
   - Build Command: kosong (atau `echo "no build"`)
   - Publish Directory: `.` (root)
5. Create Static Site. Setiap push ke branch yang dipilih akan auto-deploy.

## Catatan aksesibilitas
Jika device kamu mengaktifkan "Reduce motion", auto fireworks dimatikan dan jumlah partikel dikurangi.
