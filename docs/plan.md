# Plan: redesign portfolio jadi kota peta

Status: draf untuk dibahas, belum disetujui. Konsepnya ada di [idea.md](idea.md).
Ini plan kita sendiri, terpisah dari versi gsap di worktree `codex-portfolio-concept`.

## Tujuan

Recruiter atau tech lead ngerti siapa Ghufron dalam 10 detik dan bisa sampai ke project mana pun dengan satu klik. Orang yang punya waktu dapet perjalanan yang layak dipamerin.

## Arah desain

| Hal | Keputusan |
|---|---|
| Rasa | Poster yang bisa dijalanin: tegas, datar, ceria, tanpa hiasan |
| Font judul | Anton, huruf besar |
| Font penekanan | Instrument Serif italic, satu atau dua kata per judul |
| Font isi | Schibsted Grotesk |
| Font label | JetBrains Mono |
| Warna dasar | kertas `#f3f1ea`, tinta `#141414` |
| Warna distrik | biru `#1f3bff` pembuka, kuning `#ffd60a` project, pink `#ff8fc7` kampus, hijau `#19b866` AI, merah `#ff4a2b` ending |
| Mode malam | kertas jadi `#0e1020`, tinta jadi `#f3f1ea`, warna distrik tetap, lampu dan jendela nyala |
| Bentuk 3D | balok warna polos, bayangan tegas, tanpa tekstur foto |
| Tidak dipakai | gradien, kaca buram, glow, partikel latar, kursor custom, loader wajib, audio |

## Efek (cuma empat, diulang konsisten)

1. **Halaman rebah jadi tanah.** Layar pembuka jatuh ke belakang dan jadi peta. Sekali, di awal.
2. **Judul adegan.** Masuk distrik: judul raksasa naik per baris, nempel, lalu keluar.
3. **Banjir warna.** Warna distrik melebar dari posisi mobil sampai jadi latar panel.
4. **Kartu holo.** Di checkpoint project, kartu keluar dari gedung, kilapnya ngikutin kursor, klik membuka project.

Tambahan di luar empat itu: kamera naik di ending, dan benda yang bisa ditabrak di mode bebas.

## Urutan adegan (digerakkan scroll)

| # | Adegan | Warna | Isi | Sumber |
|---|---|---|---|---|
| 0 | Pembuka | biru | "Ghufron builds the whole thing." + dua tombol | `profile.ts` |
| 1 | Start | kertas | About tiga baris | `profile.ts` |
| 2 | Project St. | kuning | 6 checkpoint, satu kartu per project | `featuredProjects.ts` |
| 3 | Side Alley | kertas | 4 side project, satu baris masing-masing | `sideProjects.ts` |
| 4 | Campus | pink | Polines, IPK, sertifikat | `profile.ts` |
| 5 | AI Site | hijau | Lagi belajar apa, jujur | copy baru |
| 6 | Hill | merah | GHUFRON + matahari, Say hi, email, resume, blog | `profile.ts` |

Tiap project muncul sekali di halaman utama. `/projects` yang sekarang dihapus dari navigasi dan dialihkan ke adegan 2.

## Halaman lain

| Route | Nasib |
|---|---|
| `/` | Diganti kota peta |
| `/projects` | Redirect ke `/#projects` |
| `/projects/:slug` | Tetap, ganti kulit ke gaya baru. Kartu holo membesar jadi halaman ini |
| `/about` | Dilebur ke adegan 1, 4, 5. Redirect ke `/` |
| `/blog`, `/blog/:id`, `/resume` | Tetap, ganti kulit (font, warna, header) |
| `/auth`, `/admin` | Tidak disentuh |

## Arsitektur

```ts
// Production
Index page
  → SceneList (HTML asli: semua adegan, dari data/*.ts)   // selalu ada, SEO + prerender
  → ScrollConductor (gsap ScrollTrigger + lenis, sudah terpasang)
    → progress 0..1
      → SceneTitles + ColorFlood (DOM)
      → World (three.js, lazy import)
        → Road path → posisi mobil + kamera
        → Buildings → Checkpoint → HoloCard (DOM)
      → FreeDrive (cannon-es, lazy, cuma desktop)

// Fallback (reduced motion, WebGL gagal, atau "just show me the work")
Index page
  → SceneList                                              // dokumen biasa, isi sama
```

- `SceneList` adalah sumber kebenaran. 3D cuma membaca progress scroll, tidak punya isi sendiri.
- Dependency baru: `three` (wajib), `cannon-es` (cuma tahap 5). Tanpa react-three-fiber: satu canvas, satu modul.
- Styling tetap Tailwind. Warna dan font masuk ke `tailwind.config.ts` sebagai token.

## Ciri khas (yang bikin ini punya Ghufron, bukan template)

1. **Kota dari commit sendiri.** Blok pengisi kota bukan balok acak, tapi data kontribusi GitHub setahun (`githubActivity.ts`, 1.563 kontribusi): satu hari satu gedung, tinggi = jumlah commit. Ini sekaligus ngisi kota yang kosong dan mindahin skyline kontribusi dari `/projects`.
2. **Rute asli.** Perjalanannya ngikutin jalan hidup: rumah (Pemalang) → kampus (Polines, Semarang) → lokasi konstruksi (AI). Perlu dikonfirmasi Ghufron.
3. **Plang jalan Indonesia.** Nama distrik ditulis sebagai plang hijau huruf putih (`JL. PROJECT`), bukan label peta generik.
4. **Gedung berbentuk project-nya.** Lihat tabel di bawah.
5. **Matahari sebagai tombol.** Lihat bagian toggle.

## Isi kota

| Tempat | Bentuk | Fungsi |
|---|---|---|
| PB Undip | Lapangan bulu tangkis + papan skor yang angkanya jalan | Checkpoint |
| TempeMail | Kotak pos raksasa, amplop keluar tiap beberapa detik | Checkpoint |
| Curated Design | Rak terbuka berisi bingkai warna | Checkpoint |
| SewaInAja | Toko dengan barang di teras | Checkpoint |
| LSP Polines | Gedung dengan stempel besar di atap | Checkpoint |
| IMPP | Rumah organisasi dengan bendera | Checkpoint |
| Blok kota | 365 gedung dari kontribusi GitHub | Pengisi, punya makna |
| Papan reklame | Stack utama (dari `skillTiers`), satu papan per kelompok | Pengisi, gantiin section Skills |
| Kerucut, kardus, huruf G-H-U-F-R-O-N | Bisa ditabrak | Mode bebas saja |

Gedung muncul dari tanah waktu mobil mendekat (naik berurutan), bukan udah berdiri dari awal.

## Toggle siang dan malam

- Tombolnya ikon matahari di atas garis horizon. Diklik: matahari turun di balik garis, bulan naik. Sekitar 1,2 detik.
- Di dunia 3D, arah cahaya ikut muter: bayangan gedung memanjang dan menyapu, warna tanah pindah ke malam, jendela nyala berurutan.
- Di ending, bola di belakang GHUFRON ikut ganti: matahari merah di siang, bulan pucat di malam.
- Reduced motion: langsung ganti tanpa animasi.

## Animasi yang ditambah supaya nggak polos

Tetap empat efek, tapi tiap efek diperdalam, bukan ditambah efek baru.

| Bagian | Sekarang | Jadi |
|---|---|---|
| Kamera | Satu sudut dari atas sepanjang jalan | Tiap distrik punya sudut sendiri: rendah di Project St., tinggi di Campus, sejajar mata di ending |
| Gedung | Diam | Naik dari tanah saat didekati, bagian khasnya gerak (papan skor, amplop, bendera) |
| Kartu holo | Terbang dari luar layar | Keluar dari gedungnya, lalu membesar jadi halaman project saat diklik |
| Judul adegan | Naik per baris | Naik per huruf, kata italic masuk belakangan |
| Mobil | Geser kaku | Miring di tikungan, badan ngayun waktu ngerem |
| Jalan | Udah ada | Garis putusnya ngalir sesuai kecepatan scroll |

## Perbaikan dari audit prototipe `/i`

| # | Temuan | Perbaikan | Di mana |
|---|---|---|---|
| 1 | Ending kalah dari h2 | Jalan lurus panjang menuju nama setinggi mata, dua segmen scroll, nama membesar, matahari menuhin latar | Prototipe |
| 2 | Belum smooth | lenis untuk scroll, satu kurva kecepatan menerus (melambat di checkpoint, tidak berhenti), flood pakai `transform: scale` bukan `clip-path`, bayangan 1024, pixel ratio maksimal 1,5 | Prototipe |
| 3 | Daftar work polos | Halaman penuh dengan nama raksasa (udah masuk), tambah thumbnail saat hover | Prototipe |
| 4 | Nggak bisa lompat | Rel distrik di sisi layar: 6 titik, klik untuk loncat, sekaligus penanda posisi | Prototipe |
| 5 | Gedung tanpa identitas | Tabel "Isi kota" | Prototipe (2 gedung), sisanya build |
| 6 | Kartu belum bisa diklik | Kartu membesar jadi halaman project | Prototipe (1 project) |
| 7 | Panel nutupin gedungnya | Panel selalu di kanan, kamera geser supaya gedung di kiri | Prototipe |
| 8 | Label tanah ketutup | Ganti jadi plang jalan berdiri | Prototipe |
| 9 | Kota hambar | Kota dari kontribusi GitHub | Prototipe |
| 10 | Keyboard, reduced motion, HP | Panah dan PageDown pindah checkpoint, fallback dokumen, cek HP asli | Build (tahap 6) |
| 11 | Isi karangan | Ambil dari `data/*.ts` | Build (tahap 2) |

## Isi dari situs sekarang yang belum masuk

| Isi | Di situs sekarang | Di kota |
|---|---|---|
| 6 project utama | Ada, lengkap dengan case study | Ada, tapi deskripsi dan stack masih karangan |
| 4 side project | Ada, dengan deskripsi dan link | Cuma nama, dua kategorinya salah |
| IPK, semester, 5 sertifikat | Ada | Ada |
| Skills (22, lima kelompok) | Section sendiri | Belum. Jadi papan reklame + daftar di Campus |
| Pengalaman organisasi (IMPP, PCC) | Di `/about` | Belum. Masuk Campus |
| Kontribusi GitHub | Skyline di `/projects` | Belum. Jadi blok kota |
| Blog | Preview di home + `/blog` | Belum. Kios koran dekat Hill, 3 tulisan terbaru |
| Resume | `/resume` | Link di ending belum nyambung |
| Status dan lokasi ("Open to opportunities", Semarang) | Hero | Belum. Masuk layar pembuka |
| Badge finalis ITECHNO CUP 2026 (CEPAT) | Side project | Belum. Bukti paling kuat, harus keliatan |
| Email, GitHub, LinkedIn | Footer dan modal | Link ending masih kosong |
| Foto | `/about` | Belum. Masuk panel Start |

Catatan: NetraSense (YOLO, PyTorch) dan Weather Prediction (Random Forest) adalah kerjaan ML yang nyata. Dua itu dipindah dari Side Alley ke AI Site sebagai bukti, supaya AI Site bukan cuma janji.

## Tambahan supaya kerasa jadi

Urut dari yang paling ngaruh. Kota cuma pintu masuk; yang dinilai recruiter ada di baris 1 sampai 5.

| # | Hal | Isi | Tahap |
|---|---|---|---|
| 1 | Halaman case study | Bukan cuma ganti kulit. Judul raksasa warna project, screenshot besar, kontribusi dan hasil, tombol `next stop →` ke project berikutnya | 4 |
| 2 | Copy | Tiap project punya judul berupa hasil, bukan deskripsi. Satu suara dari pembuka sampai ending. Diambil dan dirapikan dari `featuredProjects.ts` | 2 |
| 3 | Pindah halaman | Kota → case study → blog → resume pakai banjir warna yang sama (efek 3), bukan potong langsung | 4 |
| 4 | Anggaran performa | Teks pembuka tampil sebelum three.js selesai dimuat. 365 gedung jadi satu `InstancedMesh`. Font di-preload dan di-subset. Target 60 fps di laptop biasa, 30 fps di HP | 3 |
| 5 | HP | Kamera dibingkai ulang untuk layar tegak, panel jadi lembar dari bawah, tombol cukup besar buat jempol | 6 |
| 6 | Pembuka | Teks masuk per baris dalam 1 detik pertama. Saat halaman rebah, teksnya ikut memudar, tidak terpotong (temuan audit yang belum masuk tabel) | 0b |
| 7 | Rel distrik jadi peta mini | Bentuknya jalan yang sama dalam ukuran kecil, titik mobil ikut jalan | 0b |
| 8 | Kota tetap hidup saat diam | Bendera berkibar, amplop keluar, papan skor jalan walau scroll berhenti | 3 |
| 9 | Gedung hari ini | Gedung kontribusi untuk hari ini masih "dibangun" dan nyala. Data GitHub-nya udah ada, dengan cadangan statis | 3 |
| 10 | Ending yang bisa dipakai | Tombol salin email dengan tanda berhasil, unduh resume, dan `ContactModal` yang udah ada | 4 |
| 11 | Tombol dan link | Satu perilaku untuk semua: bayangan tegas yang "tertekan" saat diklik, garis bawah yang menggambar saat hover, fokus keyboard jelas | 2 |
| 12 | Halaman 404 | "You drove off the map", mobil di luar jalan, tombol balik | 7 |
| 13 | Identitas kecil | Favicon G, gambar OG gaya baru, `sitemap.xml` dan `llms.txt` disesuaikan dengan route baru | 7 |
| 14 | Bersih-bersih | Hapus komponen lama yang nggak kepakai lagi (`FloatingParticles`, `AnimatedMeshGradient`, `ParallaxBackground`, `TestAnimate`, `HeroPreview`, preloader). Cek apakah `framer-motion` masih perlu | 7 |

Sengaja tidak ditambah: efek kelima, kursor custom, suara, loader, dan animasi di teks isi.

Opsional, perlu keputusan: mode siang atau malam di kunjungan pertama ngikutin jam pengunjung. Ini mengubah keputusan "light default".

## Yang perlu dari Ghufron

- Screenshot asli TempeMail, Curated Design, dan LSP Polines (sekarang masih foto Unsplash).
- Satu atau dua kalimat jujur: lagi belajar apa di AI sekarang.
- Konfirmasi rute Pemalang → Semarang boleh dipakai.
- Opsional: satu atau dua hal pribadi di luar kerjaan buat benda di kota.

## Tahapan

| Tahap | Hasil | Selesai kalau |
|---|---|---|
| 0. Prototipe `/i` (buang) | Pembuka, jalan pakai scroll, 1 checkpoint + kartu holo, ending | Putaran 1 selesai: gaya udah dipahami |
| 0b. Prototipe putaran 2 (buang) | Semua baris "Prototipe" di tabel audit, kota dari GitHub, toggle matahari, 2 gedung berbentuk | Ghufron bilang rasanya dapet dan mulus di laptopnya |
| 1. Spec | `docs/superpowers/specs/…-design.md` | Disetujui |
| 2. Fondasi | Token warna/font, header baru, `SceneList` berisi semua konten | Halaman utama kebaca penuh tanpa JS 3D, `npm run build` dan `npm run lint` lolos |
| 3. Dunia | Kota, jalan, mobil, kamera ikut scroll, judul adegan, banjir warna | Scroll dari atas ke bawah mulus di laptop biasa |
| 4. Checkpoint | Kartu holo, transisi ke case study, redirect route lama | Semua project bisa dibuka dari kartu dan dari daftar biasa |
| 5. Mode bebas | WASD, benda yang bisa ditabrak, tombol balik ke jalan | Desktop saja, tidak mengganggu mode scroll |
| 6. Malam, HP, aksesibilitas | Toggle, layout HP, reduced motion, keyboard | Dicek di HP asli, bukan cuma emulasi |
| 7. Halaman lain | Case study, blog, resume ganti kulit | Tidak ada halaman publik yang masih gaya lama |

Tahap 2 udah bisa dirilis sendiri. Tahap 5 boleh dibuang kalau waktunya nggak ada.

## Batas yang dijaga

- Teks isi selalu di panel berlatar polos, kontras minimal 4.5:1.
- Tombol `just show me the work` selalu kelihatan.
- three.js tidak di-download kalau reduced motion aktif.
- HP: mode scroll saja, tanpa fisika, bayangan dimatikan kalau frame rate jatuh.
- Canvas berhenti render kalau tab disembunyikan.

## Risiko

| Risiko | Penangkal |
|---|---|
| Scroll kerasa lambat karena adegan dipaku terlalu lama | Total panjang scroll dibatasi kira-kira 9 layar, diuji di tahap 0 |
| Berat di HP | Tahap 2 menjamin isi tetap ada, 3D diturunkan kualitasnya |
| Kebanyakan gaya sampai isinya kalah | Cuma empat efek, cuma lima warna distrik |
| Tahap 3 ke atas molor | Tahap 2 bisa rilis duluan |

## Belum diputuskan

- Project mana yang demo-nya bisa ditanam langsung, mana yang cukup screenshot.
- Bahasa copy: sementara diasumsikan Inggris santai.
- Apakah mode bebas (tahap 5) ikut rilis pertama.
