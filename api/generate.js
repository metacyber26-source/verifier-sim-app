export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'GEMINI_API_KEY belum terdeteksi di Vercel Environment Variables.' 
        });
    }

    const promptText = `Buatkan 10 skenario kasus verifikasi/validasi interaktif dalam berbagai bidang kehidupan (KYC/Identitas, Keuangan/Perbankan, Legalitas Bisnis, Forensik Digital, Aset/Teknis, Asuransi/Kesehatan).
    Tingkat kesulitan bertahap dari Level 1 (Beginner) hingga Level 10 (Expert).
    
    Setiap kasus mengevaluasi tingkat kepuasan/kelayakan dokumen berdasarkan skala 1 sampai 5:
    - Keputusan "approve": 
      * 1 = Cukup Layak (Memenuhi syarat minimal/ada catatan kecil)
      * 3 = Layak / Puas (Memenuhi standar operasional)
      * 5 = Sangat Layak / Sangat Puas (Mutlak Valid, Otentik 100%)
    - Keputusan "reject": 
      * 1 = Kurang Layak (Perlu perbaikan/revisi ringan)
      * 3 = Tidak Layak (Tidak memenuhi kualifikasi/banyak anomali)
      * 5 = Sangat Tidak Layak / Red Flag (Sangat Berbahaya / Indikasi Fraud / Manipulasi Data)

    WAJIB mengembalikan HANYA format JSON murni tanpa markdown/backticks dengan struktur array seperti ini:
    [
      {
        "id": 1,
        "level": 1,
        "category": "Kategori Bidang",
        "title": "Judul Kasus",
        "description": "Deskripsi singkat kasus dan objek verifikasi",
        "documentData": { "Field1": "Nilai1", "Field2": "Nilai2" },
        "correctAction": "approve",
        "targetWeight": 5,
        "explanation": "Penjelasan rinci mengenai alasan keputusan dan penentuan skala tingkat kepuasan/kelayakan dokumen"
      }
    ]`;

    const modelName = 'gemini-3.6-flash';
    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error?.message || `Gagal merespons dari API Gemini (${response.status}).` 
            });
        }

        if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            return res.status(500).json({ error: 'Respon dari API kosong.' });
        }

        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const parsedCases = JSON.parse(rawText);
        return res.status(200).json(parsedCases);
    } catch (err) {
        return res.status(500).json({ error: 'Server Error: ' + err.message });
    }
}
