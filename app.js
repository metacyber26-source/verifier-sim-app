const weightLabels = {
    1: "1 - CUKUP (REVISI / KETENTUAN MINIMAL)",
    2: "2 - AGAK PUAS / KURANG LAYAK",
    3: "3 - LAYAK / PUAS (STANDAR)",
    4: "4 - SANGAT LAYAK / SANGAT PUAS",
    5: "5 - MUTLAK VALID / RED FLAG (EXTREME)"
};

function setWeight(val) {
    selectedWeight = val;
    document.getElementById('weight-display').textContent = weightLabels[val];
    
    // Highlight tombol terpilih
    const buttons = document.querySelectorAll('.btn-weight');
    buttons.forEach((btn, idx) => {
        if (idx + 1 === val) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
