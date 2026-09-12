export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di Vercel Environment Variables.' });
    }

    const prompt = `Buatkan 10 skenario kasus verifikasi/validasi interaktif dalam berbagai bidang kehidupan (KYC/Identitas, Keuangan/Perbankan, Legalitas Bisnis, Forensik Digital, Aset/Teknis, Asuransi/Kesehatan).
    Tingkat kesulitan harus bertahap dari Level 1 (Beginner) hingga Level 10 (Expert).
    Kembalikan HANYA format JSON murni tanpa markdown/backticks dengan struktur array seperti ini:
    [
      {
        "id": 1,
        "level": 1,
        "category": "Kategori Bidang",
        "title": "Judul Kasus",
        "description": "Deskripsi singkat kasus",
        "documentData": { "Field1": "Nilai1", "Field2": "Nilai2" },
        "correctAction": "approve",
        "explanation": "Penjelasan rinci mengapa disetujui/ditolak"
      }
    ]`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0]) {
            return res.status(500).json({ error: 'Respon API tidak valid.' });
        }

        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const cases = JSON.parse(rawText);
        return res.status(200).json(cases);
    } catch (err) {
        return res.status(500).json({ error: 'Gagal membuat kasus: ' + err.message });
    }
}
