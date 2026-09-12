export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'GEMINI_API_KEY belum terdeteksi. Silakan pastikan Anda sudah menambahkan API Key dan melakukan Redeploy di Vercel.' 
        });
    }

    const promptText = `Buatkan 10 skenario kasus verifikasi/validasi interaktif dalam berbagai bidang kehidupan (KYC/Identitas, Keuangan/Perbankan, Legalitas Bisnis, Forensik Digital, Aset/Teknis, Asuransi/Kesehatan).
    Tingkat kesulitan harus bertahap dari Level 1 (Beginner) hingga Level 10 (Expert).
    WAJIB mengembalikan HANYA format JSON murni tanpa markdown, tanpa backticks (\`\`\`json), dengan struktur array JSON berikut:
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

    // Menggunakan model 'gemini-2.5-flash' (atau alias 'gemini-flash' yang selalu mengarah ke versi terbaru)
    const modelName = 'gemini-2.5-flash';
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
            return res.status(500).json({ error: 'Respon dari API kosong atau tidak valid.' });
        }

        let rawText = data.candidates[0].content.parts[0].text;
        
        // Membersihkan format markdown backticks jika disertakan oleh AI
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const parsedCases = JSON.parse(rawText);
        return res.status(200).json(parsedCases);
    } catch (err) {
        return res.status(500).json({ error: 'Server Error: ' + err.message });
    }
}
