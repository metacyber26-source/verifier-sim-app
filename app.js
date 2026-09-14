let currentCaseIndex = 0;
let userScore = 0;
let userLevel = 1;
let dailyCases = [];
let selectedWeight = 3; // Default Bobot = 3

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const savedCases = localStorage.getItem('daily_cases');
    if (savedCases) {
        try {
            dailyCases = JSON.parse(savedCases);
            loadCase(0);
        } catch(e) {
            console.error("Cache reset.");
        }
    }
});

function setWeight(val) {
    selectedWeight = val;
    document.getElementById('weight-display').textContent = val;
    
    // Update Active Button UI
    const buttons = document.querySelectorAll('.btn-weight');
    buttons.forEach((btn, idx) => {
        if (idx + 1 === val) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

async function generateDailyCases() {
    const btn = document.getElementById('btn-generate');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="spin"></i> Memuat 10 Kasus Baru...`;
    lucide.createIcons();

    try {
        const response = await fetch('/api/generate', { method: 'POST' });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Terjadi kesalahan pada server Vercel.');
        }

        dailyCases = data;
        localStorage.setItem('daily_cases', JSON.stringify(dailyCases));
        
        currentCaseIndex = 0;
        loadCase(0);
    } catch (err) {
        alert('Gagal Memuat Kasus: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="sparkles"></i> GENERATE 10 KASUS HARI INI`;
        lucide.createIcons();
    }
}

function loadCase(index) {
    if (!dailyCases || dailyCases.length === 0) return;
    if (index >= dailyCases.length) {
        alert('Selamat! Anda telah menyelesaikan seluruh 10 kasus simulasi hari ini.');
        return;
    }

    const currentCase = dailyCases[index];

    document.getElementById('feedback-card').classList.add('hidden');
    document.getElementById('action-area').classList.remove('hidden');

    document.getElementById('case-category').textContent = currentCase.category;
    document.getElementById('case-level-tag').textContent = `LEVEL ${currentCase.level}`;
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

    // Reset Weight to 3
    setWeight(3);

    const progress = ((index + 1) / dailyCases.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function handleDecision(userChoice) {
    const currentCase = dailyCases[currentCaseIndex];
    const isActionCorrect = userChoice === currentCase.correctAction;
    
    // Perhitungan Akurasi Bobot
    const targetWeight = currentCase.targetWeight || 3;
    const weightDiff = Math.abs(selectedWeight - targetWeight); // 0 jika persis sama

    document.getElementById('action-area').classList.add('hidden');
    const feedbackCard = document.getElementById('feedback-card');
    feedbackCard.classList.remove('hidden', 'correct', 'incorrect');

    if (isActionCorrect) {
        let earnedXP = currentCase.level * 50;
        
        if (weightDiff === 0) {
            feedbackCard.classList.add('correct');
            document.getElementById('feedback-title').textContent = "PERFECT! KEPUTUSAN & BOBOT AKURAT!";
            document.getElementById('feedback-text').textContent = `Keputusan tepat dan skala bobot (${selectedWeight}/5) sangat akurat sesuai profil risiko.`;
            earnedXP += 30; // Bonus XP Bobot Akurat
        } else {
            feedbackCard.classList.add('correct');
            document.getElementById('feedback-title').textContent = "KEPUTUSAN TEPAT (BOBOT KURANG AKURAT)";
            document.getElementById('feedback-text').textContent = `Tindakan tepat, namun skala bobot ideal adalah ${targetWeight}/5 (Pilihan Anda: ${selectedWeight}/5).`;
        }

        userScore += earnedXP;
        document.getElementById('score-val').textContent = userScore;
        userLevel = Math.floor(userScore / 100) + 1;
        document.getElementById('level-val').textContent = userLevel;

    } else {
        feedbackCard.classList.add('incorrect');
        document.getElementById('feedback-title').textContent = "KEPUTUSAN KELIRU!";
        document.getElementById('feedback-text').textContent = `Tindakan yang diambil tidak sesuai. Target yang benar: ${currentCase.correctAction.toUpperCase()} dengan bobot ${targetWeight}/5.`;
    }

    document.getElementById('feedback-reason').textContent = currentCase.explanation;
    lucide.createIcons();
}

function nextCase() {
    currentCaseIndex++;
    loadCase(currentCaseIndex);
}
