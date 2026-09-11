const caseDatabase = [
    // --- LEVEL 1-3 (BEGINNER) ---
    {
        id: 1,
        level: 1,
        category: "Verifikasi KYC / Identitas",
        title: "Pemeriksaan Masa Berlaku KTP",
        description: "Pengguna mengunggah dokumen identitas resmi untuk pendaftaran akun finansial.",
        documentData: {
            "Nama Pemilik": "Budi Santoso",
            "Nomor NIK": "3515012304880001",
            "Masa Berlaku KTP": "12 April 2021",
            "Status Dokumen": "Terbaca Jelas"
        },
        correctAction: "reject",
        explanation: "Dokumen harus ditolak (REJECT) karena masa berlaku KTP sudah kadaluarsa (2021), meskipun fisik dokumen terbaca jelas."
    },
    {
        id: 2,
        level: 2,
        category: "Verifikasi Keuangan",
        title: "Kesesuaian Slip Gaji vs Rekening",
        description: "Pengajuan pinjaman mikro memerlukan validasi pendapatan bulanan.",
        documentData: {
            "Nama Karyawan": "Siti Aminah",
            "Nominal Slip Gaji": "Rp 7.500.000",
            "Kredit Rekening 3 Bln": "Rp 7.500.000 / bln",
            "Nama Rekening Bank": "Siti Aminah"
        },
        correctAction: "approve",
        explanation: "Keputusan tepat (APPROVE). Data nominal gaji konsisten dengan mutasi masuk di rekening bank atas nama yang sama."
    },
    {
        id: 3,
        level: 3,
        category: "Verifikasi Aset & Teknis",
        title: "Inspeksi Foto Fisik Kendaraan",
        description: "Validasi klaim asuransi kerusakan fisik kendaraan.",
        documentData: {
            "Nomor Polisi Dokumen": "AG 1234 BR",
            "Nomor Polisi Foto": "AG 1234 BR",
            "Kerusakan Diklaim": "Bumper Depan Penyok",
            "Foto Lampiran": "Foto Bumper Belakang Rusak"
        },
        correctAction: "reject",
        explanation: "Tolak (REJECT). Terdapat ketidaksesuaian objek klaim (klaim bagian depan, namun foto bukti menampilkan bagian belakang)."
    },

    // --- LEVEL 4-7 (INTERMEDIATE) ---
    {
        id: 4,
        level: 4,
        category: "Analisis Anomali Data",
        title: "Verifikasi Lokasi & Jam Transaksi",
        description: "Deteksi indikasi potensi penyalahgunaan/fraud transaksi kartu kredit.",
        documentData: {
            "User ID": "USR-9921",
            "Tx 1 (14:00 WIB)": "Merchant POS - Jakarta (Rp 50.000)",
            "Tx 2 (14:05 WIB)": "Merchant POS - Surabaya (Rp 12.000.000)",
            "Perangkat": "Mobile App Registered"
        },
        correctAction: "reject",
        explanation: "Tolak (REJECT). Terjadi anomali fisik/geografis yang tidak mustahil secara fisik (Impossible Travel Fraud: Jakarta ke Surabaya dalam waktu 5 menit)."
    },
    {
        id: 5,
        level: 6,
        category: "Verifikasi Dokumen Bisnis",
        title: "Silang Data NIB & Legalitas Usaha",
        description: "Validasi pendaftaran merchant e-commerce komersial.",
        documentData: {
            "Nama Usaha": "CV Maju Gemilang",
            "KBLI Terdaftar": "47411 (Perdagangan Komputer)",
            "Izin Khusus Didatangkan": "Peredaran Obat Keras",
            "Status OSS": "Aktif"
        },
        correctAction: "reject",
        explanation: "Tolak (REJECT). KBLI terdaftar adalah Perdagangan Komputer, tidak memiliki kualifikasi/izin komersial untuk mendistribusikan obat keras."
    },

    // --- LEVEL 8-10 (EXPERT) ---
    {
        id: 6,
        level: 8,
        category: "Deteksi Forensik Digital",
        title: "Manipulasi EXIF Metadata Aset Foto",
        description: "Verifikasi keaslian foto jaminan aset tanah/properti.",
        documentData: {
            "Tanggal Klaim Foto": "10 September 2026",
            "Metadata EXIF Date": "15 Januari 2018",
            "Software Editing Detected": "Adobe Photoshop 2024 (Modified)",
            "Geotagging GPS": "Cocok dengan Lokasi Sawah"
        },
        correctAction: "reject",
        explanation: "Tolak (REJECT) tingkat lanjut. Metadata EXIF membuktikan foto dibuat tahun 2018 dan telah diedit melalui software manipulasi, bukan foto *real-time* kondisi aset terkini."
    },
    {
        id: 7,
        level: 10,
        category: "Risiko Tinggi & Regulasi Kompleks",
        title: "Pemeriksaan AML / Compliance PEP",
        description: "Verifikasi transaksi bernilai jumbo dari akun Politically Exposed Person (PEP).",
        documentData: {
            "Pengirim": "Pejabat Publik Aktif",
            "Nominal Transaksi": "Rp 2.500.000.000",
            "Sumber Dana Declared": "Tabungan Pribadi",
            "Dokumen Pendukung": "Pernyataan Pajak & Surat Hibah Tidak Notariil"
        },
        correctAction: "reject",
        explanation: "Tolak (REJECT). Sesuai standar Anti-Money Laundering (AML), dokumen pendukung berupa hibah tanpa legalisasi notaris formal untuk PEP bernilai tinggi wajib ditolak/ditahan untuk investigasi mendalam."
    }
];
