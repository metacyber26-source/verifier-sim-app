# 🛡️ VerifierSim Community - Simulator Verifikator Interaktif (Metaverse HUD Edition)

**VerifierSim Community** adalah aplikasi web pembelajaran dan simulasi interaktif berkonsep futuristik (Cyberpunk/Metaverse HUD) yang dirancang untuk meningkatkan keterampilan verifikator dan validator secara bertahap, mulai dari Level 1 (Beginner) hingga Level 10 (Expert) di berbagai bidang kehidupan.

Aplikasi ini menggunakan teknologi **Generative AI (Google Gemini 1.5 Flash)** untuk memproduksi **10 kasus simulasi harian otomatis** yang unik, dinamis, dan mencakup berbagai disiplin bidang verifikasi (KYC/Identitas, Keuangan/Perbankan, Legalitas Bisnis, Forensik Digital, Aset/Teknis, dan Asuransi/Kesehatan).

---

## ✨ Fitur Utama

- **🤖 Automated Daily Cases (AI Powered):** Menghasilkan 10 skenario simulasi verifikasi baru setiap hari dalam satu kali klik.
- **📊 10 Tingkat Kesulitan Berjenjang:**
  - **Level 1–3 (Beginner):** Kasus jelas dengan indikator kesalahan/keabsahan yang mudah dikenali.
  - **Level 4–7 (Intermediate):** Kasus ambigu, membutuhkan analisis silang data atau deteksi anomali.
  - **Level 8–10 (Expert):** Kasus kompleks, manipulasi data/EXIF metadata tingkat lanjut, dan regulasi ketat (AML/PEP).
- **⚡ Instant Feedback Evaluation:** Evaluasi dan analisis detail dari sudut pandang verifikator profesional langsung ditampilkan setelah keputusan dibuat.
- **🏆 Gamifikasi & Sistem XP:** Poin XP dan Level pengguna meningkat seiring dengan ketepatan analisis keputusan.
- **🔒 Secure Serverless Architecture:** API Key Gemini disimpan secara aman di backend Vercel (Environment Variables), sehingga aman digunakan oleh seluruh anggota komunitas tanpa perlu menginput API Key masing-masing.
- **📱 Fully Mobile Responsive (Optimized for Samsung Galaxy A16):** Tampilan Metaverse HUD dengan efek Glassmorphic & Cyber Glow yang ringan, responsif, dan nyaman digunakan di layar smartphone.

---

## 🛠️ Stack Teknologi

- **Frontend:** Pure HTML5, CSS3 (Custom Properties & Glassmorphism), Modern JavaScript (ES6+).
- **Icons & Fonts:** Lucide Icons, Google Fonts (Orbitron & Plus Jakarta Sans).
- **Backend / API Route:** Vercel Serverless Functions (`/api/generate.js`).
- **AI Engine:** Google Gemini 1.5 Flash API (REST Endpoint).
- **Hosting & Deployment:** GitHub & Vercel.

---

## 📂 Struktur Repository

```text
verifier-sim-app/
├── api/
│   └── generate.js     # Vercel Serverless Function (Proxy API Gemini)
├── index.html          # Layout Utama Aplikasi UI Metaverse HUD
├── styles.css          # Styling Theme Cyberpunk / Glassmorphism
├── app.js              # Logika Game, Gamifikasi & State Management
├── vercel.json         # Routing Rewrites Vercel
└── README.md           # Dokumentasi Proyek
