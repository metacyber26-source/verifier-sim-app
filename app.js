let currentCaseIndex = 0;
let userScore = 0;
let userLevel = 1;
let dailyCases = [];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const savedCases = localStorage.getItem('daily_cases');
    if (savedCases) {
        try {
            dailyCases = JSON.parse(savedCases);
            loadCase(0);
        } catch(e) {
            console.error("Cache corrupted, reset state.");
        }
    }
});

async function generateDailyCases() {
    const btn = document.getElementById('btn-generate');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="spin"></i> Memuat 10 Kasus Baru...`;
    lucide.createIcons();

    try {
        const response = await fetch('/api/generate', {
            method: 'POST'
        });

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
        document.getElementById('feedback-title').textContent = "KEPUTUSAN TEPAT!";
        document.getElementById('feedback-text').textContent = "Analisis dan keputusan Anda telah sesuai standar verifikator.";
        
        userScore += currentCase.level * 50;
        document.getElementById('score-val').textContent = userScore;
        userLevel = Math.floor(userScore / 100) + 1;
        document.getElementById('level-val').textContent = userLevel;
    } else {
        feedbackCard.classList.add('incorrect');
        document.getElementById('feedback-title').textContent = "KEPUTUSAN KELIRU!";
        document.getElementById('feedback-text').textContent = "Terdapat indikasi anomali atau risiko yang terlewatkan.";
    }

    document.getElementById('feedback-reason').textContent = currentCase.explanation;
    lucide.createIcons();
}

function nextCase() {
    currentCaseIndex++;
    loadCase(currentCaseIndex);
}
