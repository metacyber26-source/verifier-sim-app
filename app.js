let currentCaseIndex = 0;
let userScore = 0;
let userLevel = 1;
let dailyCases = [];

// Load Local Storage on Init
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const savedApiKey = localStorage.getItem('gemini_api_key');
    const savedCases = localStorage.getItem('daily_cases');
    
    if (savedCases) {
        dailyCases = JSON.parse(savedCases);
        loadCase(0);
    }
});

function toggleApiModal() {
    const modal = document.getElementById('api-modal');
    modal.classList.toggle('hidden');
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    document.getElementById('api-key-input').value = savedKey;
}

function saveApiKey() {
    const key = document.getElementById('api-key-input').value.trim();
    if (key) {
        localStorage.setItem('gemini_api_key', key);
        alert('API Key berhasil disimpan!');
        toggleApiModal();
    }
}

async function generateDailyCases() {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        alert('Silakan masukkan Gemini API Key terlebih dahulu melalui ikon kunci di atas.');
        toggleApiModal();
        return;
    }

    const btn = document.getElementById('btn-generate');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="spin"></i> Memproses 10 Kasus...`;
    lucide.createIcons();

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
        "correctAction": "approve" ATAU "reject",
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
        let rawText = data.candidates[0].content.parts[0].text;
        
        // Clean JSON formatting if enclosed in codeblocks
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        dailyCases = JSON.parse(rawText);
        localStorage.setItem('daily_cases', JSON.stringify(dailyCases));
        
        currentCaseIndex = 0;
        loadCase(0);
        alert('Berhasil membuat 10 kasus verifikasi harian baru!');
    } catch (err) {
        alert('Gagal membuat kasus: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="sparkles"></i> Generate 10 Kasus Hari Ini (AI)`;
        lucide.createIcons();
    }
}

function loadCase(index) {
    if (!dailyCases || dailyCases.length === 0) return;
    if (index >= dailyCases.length) {
        alert('Selamat! Anda telah menyelesaikan 10 kasus verifikasi hari ini.');
        return;
    }

    const currentCase = dailyCases[index];

    document.getElementById('feedback-card').classList.add('hidden');
    document.getElementById('action-area').classList.remove('hidden');

    document.getElementById('case-category').textContent = currentCase.category;
    document.getElementById('case-level-tag').textContent = `Level ${currentCase.level}`;
    document.getElementById('case-title').textContent = currentCase.title;
    document.getElementById('case-desc').textContent = currentCase.description;

    const docViewer = document.getElementById('doc-viewer');
    docViewer.innerHTML = '';
    for (const [key, value] of Object.entries(currentCase.documentData)) {
        const fieldRow = document.createElement('div');
        fieldRow.className = 'doc-field';
        fieldRow.innerHTML = `
            <span class="doc-label">${key}</span>
            <span class="doc-val">${value}</span>
        `;
        docViewer.appendChild(fieldRow);
    }

    const progress = ((index + 1) / dailyCases.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function handleDecision(userChoice) {
    const currentCase = dailyCases[currentCaseIndex];
    const isCorrect = userChoice === currentCase.correctAction;

    document.getElementById('action-area').classList.add('hidden');
    const feedbackCard = document.getElementById('feedback-card');
    feedbackCard.classList.remove('hidden', 'correct', 'incorrect');

    if (isCorrect) {
        feedbackCard.classList.add('correct');
        document.getElementById('feedback-title').textContent = "Keputusan Tepat!";
        document.getElementById('feedback-text').textContent = "Analisis dan tindakan verifikasi Anda sesuai prosedur.";
        
        userScore += currentCase.level * 50;
        document.getElementById('score-val').textContent = userScore;
        userLevel = Math.floor(userScore / 100) + 1;
        document.getElementById('level-val').textContent = userLevel;
    } else {
        feedbackCard.classList.add('incorrect');
        document.getElementById('feedback-title').textContent = "Keputusan Keliru!";
        document.getElementById('feedback-text').textContent = "Terdapat anomali/risiko yang terlewatkan.";
    }

    document.getElementById('feedback-reason').textContent = currentCase.explanation;
    lucide.createIcons();
}

function nextCase() {
    currentCaseIndex++;
    loadCase(currentCaseIndex);
}
