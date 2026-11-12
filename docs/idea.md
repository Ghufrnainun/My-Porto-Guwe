# Idea: kota peta Ghufron

Status: ide yang disimpan, belum disetujui jadi arah final. Belum ada spec atau plan.
Ditulis 2026-11-12, dari review tiga prototipe all-out (Toybox, Ink, Planet).

## Satu kalimat

Portfolio berbentuk kota kecil bergaya aplikasi peta: scroll bikin mobilnya jalan sendiri lewat semua isi, WASD ngasih kemudi ke pengunjung.

## Asal-usul (apa yang diambil dari tiap prototipe)

| Prototipe | Yang diambil | Yang dibuang |
|---|---|---|
| Toybox (h1) | Fisika yang mulus: benda bisa ditabrak dan dilempar | Layar tanpa penjelasan siapa Ghufron |
| Ink (h2) | Perjalanan dengan scroll, ending GHUFRON raksasa + matahari + "Say hi" | Dua warna dither yang bikin teks nggak kebaca |
| Planet (h3) | Nyetir WASD, project sebagai gedung, AI "under construction" | Bentuk planet dan nama "Planet Ghufron" |

## Alur

1. **Pembuka.** Layar warna solid, satu kalimat besar: siapa Ghufron, ngerjain apa, menuju ke mana. Dua tombol: `explore` dan `just show me the work`. Tidak ada loader yang wajib ditunggu.
2. **Kota.** Tanah datar dilihat miring dari atas. Nama jalan dan distrik ditulis besar di tanah seperti label peta.
3. **Checkpoint.** Mobil sampai di gedung, panel berlatar polos terbuka: nama project, peran, stack, demo atau screenshot, link live.
4. **Ending.** Jalan keluar kota naik ke bukit: GHUFRON raksasa, matahari di belakang, "Say hi" dan kontak.

## Distrik

| Distrik | Isi | Sumber data |
|---|---|---|
| Jalan project | 6 gedung: PB UNDIP, TempeMail, Curated Design, SewaInAja, LSP Polines, IMPP | `src/data/featuredProjects.ts` |
| Gang kecil | Side project: CEPAT, NetraSense, Weather IoT, Web Map Contour | `src/data/sideProjects.ts` |
| Kampus | Polines, semester, IPK, sertifikat (MikroTik, Oracle, TEPPS) | `src/data/profile.ts` |
| Lokasi konstruksi | AI engineering, jujur: masih belajar | copy baru |
| Rumah | About, kontak, resume, blog | profile + route yang ada |

## Dua cara jalan

- **Scroll = nyetir otomatis.** Mobil ikut jalan utama dan berhenti di tiap checkpoint secara berurutan. Ini mode default, mode HP, dan mode recruiter.
- **WASD / tahan mouse = bebas.** Begitu ada input setir, kemudi pindah ke pengunjung. Tombol `back to the road` balikin ke mode scroll.

## Aturan yang nggak boleh dilanggar

- Teks isi tidak pernah numpang di atas 3D. Selalu di panel berlatar polos.
- `just show me the work` selalu kelihatan dan membuka daftar HTML biasa berisi semua project.
- Semua isi ada sebagai HTML asli (buat SEO, prerender, pembaca layar). 3D-nya lapisan di atas.
- Reduced motion atau WebGL gagal: jatuh ke halaman dokumen biasa dengan isi yang sama.
- Light default, toggle dark tetap ada. Dark = peta malam: lampu jalan dan jendela nyala.
- Tanpa audio.
- Hanya tampilan publik yang dibangun ulang. Admin, editor blog, auth, Supabase tidak disentuh.

## Bumbu

- Kerucut jalan, kardus, dan huruf G-H-U-F-R-O-N berserakan dan bisa ditabrak (fisika).
- Kompas kecil ke checkpoint terdekat.
- Huruf G sebagai logo dan favicon.

## Risiko

- Paling berat dikerjain dari semua opsi: three.js + fisika adalah dependency baru dan berat buat HP.
- Mode scroll-nyetir harus kerasa cepat. Kalau lambat, seluruh situs kerasa lambat.
- Paling jauh dari referensi yang dikumpulin (hampir semuanya dokumen scroll, bukan dunia yang bisa dijelajahi).

## Belum diputuskan

- Kota ini jadi halaman utama, atau jadi halaman bonus (`/world`) di samping halaman utama yang lebih biasa.
- Project mana yang bisa ditanam demo live-nya, mana yang cukup screenshot.
- Nasib halaman `/about`, `/projects`, `/blog`, `/resume`: dilebur ke kota atau tetap halaman sendiri.
- Kartu holo (ide dari holo.yashb.xyz) sebagai bentuk project di checkpoint.
