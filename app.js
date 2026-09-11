let currentCaseIndex = 0;
let userScore = 0;
let userLevel = 1;

// DOM Elements
const scoreVal = document.getElementById('score-val');
const levelVal = document.getElementById('level-val');
const progressFill = document.getElementById('progress-fill');
const caseCategory = document.getElementById('case-category');
const caseLevelTag = document.getElementById('case-level-tag');
const caseTitle = document.getElementById('case-title');
const caseDesc = document.getElementById('case-desc');
const docViewer = document.getElementById('doc-viewer');
const actionArea = document.getElementById('action-area');
const feedbackCard = document.getElementById('feedback-card');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadCase(currentCaseIndex);
    lucide.createIcons();
});

function loadCase(index) {
    if (index >= caseDatabase.length) {
        // Tamat / Loop / Restart
        currentCaseIndex = 0;
        index = 0;
    }

    const currentCase = caseDatabase[index];

    // Reset UI State
    feedbackCard.classList.add('hidden');
    actionArea.classList.remove('hidden');

    // Set Data UI
    caseCategory.textContent = currentCase.category;
    caseLevelTag.textContent = `Level ${currentCase.level}`;
    caseTitle.textContent = currentCase.title;
    caseDesc.textContent = currentCase.description;

    // Render Document Fields
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

    // Update Progress Bar
    const progress = ((index + 1) / caseDatabase.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function handleDecision(userChoice) {
    const currentCase = caseDatabase[currentCaseIndex];
    const isCorrect = userChoice === currentCase.correctAction;

    // Show Feedback
    actionArea.classList.add('hidden');
    feedbackCard.classList.remove('hidden', 'correct', 'incorrect');

    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackReason = document.getElementById('feedback-reason');

    if (isCorrect) {
        feedbackCard.classList.add('correct');
        feedbackTitle.textContent = "Keputusan Tepat!";
        feedbackText.textContent = "Analisis dan tindakan verifikasi Anda sudah sesuai prosedur.";
        
        // Add Points
        const pointsEarned = currentCase.level * 50;
        userScore += pointsEarned;
        scoreVal.textContent = userScore;

        // Level Up Logic
        userLevel = Math.floor(userScore / 100) + 1;
        levelVal.textContent = userLevel;
    } else {
        feedbackCard.classList.add('incorrect');
        feedbackTitle.textContent = "Keputusan Keliru!";
        feedbackText.textContent = "Keputusan yang diambil memiliki risiko tinggi atau ketidaksesuaian.";
    }

    feedbackReason.textContent = currentCase.explanation;
    lucide.createIcons();
}

function nextCase() {
    currentCaseIndex++;
    loadCase(currentCaseIndex);
}
