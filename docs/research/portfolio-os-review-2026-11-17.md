# Review referensi portfolio OS — 17 Nov 2026

## Cakupan dan tingkat bukti

Audit live mencakup 24 situs di [referensi yang diberikan](file:///C:/Users/LENOVO/Downloads/referensi-portfolio-os-ghufron.md). Semua 24 situs dilaporkan berhasil dimuat. Interaksi di kolom tengah adalah yang benar-benar dikonfirmasi saat sweep; fitur lain di kolom terakhir berasal dari catatan referensi dan belum tentu dicoba ulang. Atom63 dibuka pada sweep ini tetapi masih di layar loading; uraian fiturnya di bawah hanya klaim dari referensi, bukan verifikasi baru. Tidak semua situs diuji di ponsel atau diuji drag.

| # | Situs | Interaksi terkonfirmasi live | Klaim referensi / batas bukti |
|---:|---|---|---|
| 1 | [PouyaOS](https://pouyashahri.com/) | Start dibuka | Windows 11 desktop, ikon dan Explorer; drag belum diuji. |
| 2 | [RI/OS](https://robertoizquierdo.com/en/) | Search modal dibuka; petunjuk keyboard terlihat | Jendela draggable/resizable dan 35 proyek adalah klaim sumber. |
| 3 | [Roshish Shrestha](https://macos.rosh.sh/) | About Me membuka jendela Contacts (label tidak cocok) | Boot dan desktop Mac dicatat; perilaku jendela lain belum diuji. |
| 4 | [Parinaz Kassemi](https://www.parinazkassemi.com/) | Tidak mencapai desktop; loader “Preparing desktop” menetap, inventaris aplikasi AX saja | Lock screen, widget live dan app adalah klaim referensi, tidak terverifikasi pada sweep ini. |
| 5 | [Passion OS](https://www.jamesdare.com/os) | Portfolio membuka daftar APPLICATIONS | Referensi menyebut lock screen, 34 proyek dan jendela draggable/resizable. |
| 6 | [Yoyal Limbu](https://yoyallimbu.com.np/#desktop) | Login guest masuk desktop | Desktop/taskbar dan ikon dicatat; interaksi app lain tidak dikonfirmasi. |
| 7 | [EddyOS](https://eddy-naboulet.dev/) | Projects menavigasi ke konten | Sumber menyatakan app berupa navigasi halaman, bukan jendela draggable. |
| 8 | [RobbyOS ’96](https://robbyyeager.com/) | Clippy ditutup | Start, taskbar dan fitur lain berasal dari referensi; tidak diuji satu per satu. |
| 9 | [MitchIvin XP](https://mitchivin.com/) | Login masuk desktop | Sumber menyebut Start menu dan menu klik-kanan berfungsi; belum diverifikasi ulang. |
| 10 | [PortfolioXP / Paul Jaguin](https://pauljaguin.com/) | Mes projets membuka Explorer | Konten proyek klien adalah klaim sumber; drag belum diuji. |
| 11 | [InspiredMonster OS](https://www.inspiredos.com/) | About membuka jendela profil | Desktop Win95 dan app lain dicatat di sumber; tidak semuanya diinteraksi. |
| 12 | [Don Chia](https://www.donchia.tech/) | Biography sudah tampil terbuka | Desktop dan tombol taskbar dicatat; interaksi lain tidak dikonfirmasi. |
| 13 | [Vivek Patel](https://vivek9patel.github.io/) | About membuka jendela | Ubuntu top bar, dock, sidebar navigasi tercatat; drag belum diuji. |
| 14 | [Tony Dinh](https://dinhquangtrung.net/windows7/) | Start menu dibuka | App yang terdaftar berasal dari sumber; peluncuran app belum dikonfirmasi. |
| 15 | [Xiaohan Zou](https://portfolio.zxh.me/) | Bear Projects sidebar dipilih | Login, menu bar, dock dan catatan Bear dicatat; drag belum diuji. |
| 16 | [XO-OS / Alex Ojanen](https://alexojanen.com/) | Klik About tidak terkonfirmasi | Jendela video dan organisasi folder adalah klaim sumber, belum diuji interaksinya. |
| 17 | [Joey de Ruiter](https://joeyderuiter.me/) | Tab Projects pada jendela About dipilih | Doom playable disebut di sumber, tetapi tidak diuji ulang. |
| 18 | [Heather Vandervecht](https://heathervv.com/) | Work membuka jendela | HeatherBot dan dialog shutdown tercatat; bot tidak diuji. |
| 19 | [Insaf Khamzin](https://insafkhamzin.com/) | Projects.txt dibuka di Notepad | Explorer dan file lain berasal dari sumber; drag belum diuji. |
| 20 | [Kaio Felipe Silva](https://kaiofelipejs.dev/) | Blog terlihat; klik tidak dikonfirmasi | Jendela profil dan Explorer dicatat di referensi, tanpa interaksi ulang terkonfirmasi. |
| 21 | [Ren OS / Hasan Ovi](https://iamovi.github.io/tfish) | `help` pada PowerShell | Command terminal memberi navigasi; alur command lain tidak diuji. |
| 22 | [ZUI_OS / Zui Chen](https://zui.ooo) | `help` di terminal | Referensi mencatat modul dan command; termasuk terminal murni, bukan desktop grafis. |
| 23 | [Jack Adam](https://jackadam.com/) | Tech membuka jendela | Sumber mencatat desktop minimal tanpa taskbar/menu bar/boot. |
| 24 | [PRIME OS / Cyber Prime](https://cyber-prime.pl) | Projects dibuka | Agensi, bukan portfolio personal; tools klien yang deployed adalah klaim sumber. |

## Keputusan desain untuk portfolio OS Mac/Linux

- Pakai desktop langsung dengan top bar ringkas, dock yang jelas, jam/status, dan jendela dengan kontrol yang dapat dipahami. Referensi Ubuntu Vivek serta Mac Roshish, Xiaohan dan RI/OS menunjukkan pola OS yang tetap terbaca; audit ini mengonfirmasi beberapa interaksi, bukan kualitas drag/responsifnya.
- Buat isi portfolio mudah ditemukan: Projects, About, Resume, Contact. Konten sebagai folder/file (Pouya, Paul, Insaf) memberi metafora yang kuat, tetapi jangan mengharuskan pengunjung menebak command.
- Tambahkan pencarian/launcher keyboard sebagai jalur cepat, dengan label dan affordance yang terlihat. Search RI/OS terkonfirmasi membuka modal; terminal Hasan dan Zui membuktikan command bisa menjadi variasi, tetapi lebih tepat sebagai app opsional daripada satu-satunya navigasi.
- Hindari boot/lock yang menunda akses dan layar penuh widget. Parinaz tidak melewati loader pada sweep; desain yang dituju sebaiknya langsung usable, dengan satu elemen personal yang menonjol (misalnya mini terminal atau widget lokal).
- Prioritaskan kontrol keyboard, fokus yang terlihat, tombol jendela berlabel, target klik cukup besar, dan layout mobile. Sweep eksternal belum menguji aksesibilitas, drag keyboard, atau mobile secara menyeluruh; ini kebutuhan implementasi, bukan klaim bahwa referensi telah memenuhinya.

## Batasan

Ini ringkasan audit browser langsung dengan interaksi terpilih, bukan pengujian penuh tiap app. Fitur yang tidak tercatat sebagai interaksi terkonfirmasi harus diperlakukan sebagai observasi sumber saja. Situs dapat berubah setelah 17 Nov 2026.
