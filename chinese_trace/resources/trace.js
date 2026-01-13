window.jsPDF = window.jspdf.jsPDF;

const generatePdfBtn = document.getElementById('generate-pdf');
const refreshBatchBtn = document.getElementById('refresh-batch');
const pageCountInput = document.getElementById('page-count');
const fontSelector = document.getElementById('font-family');
const difficultySelector = document.getElementById('difficulty-level');
const fontStatus = document.getElementById('font-status');
const characterStatus = document.getElementById('character-status');
const previewCanvas = document.getElementById('preview-canvas');
const characterListDiv = document.getElementById('character-list');

let selectedCharactersBatch = [];

/**
 * Synchronously renders a character to a temporary canvas and adds it to the PDF as an image.
 */
function addCharacterImageToPdf(doc, character, color, fontFamily, x, y, size) {
    const canvas = document.createElement('canvas');
    canvas.width = 400; 
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = `280px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2);
    
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    doc.addImage(imgData, 'JPEG', x, y, size, size);
}

function updateStylePreview() {
    const fontFamily = fontSelector.value;
    const ctx = previewCanvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = `120px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('永', previewCanvas.width / 2, previewCanvas.height / 2);
    
    // Also update the font in the batch preview items
    const items = document.querySelectorAll('.preview-char-item');
    items.forEach(item => {
        item.style.fontFamily = fontFamily;
    });
}

function refreshCharacterBatch() {
    const pageCount = parseInt(pageCountInput.value, 10) || 1;
    const totalCharsNeeded = pageCount * 6;
    const level = difficultySelector.value;
    selectedCharactersBatch = [];
    
    let availableCharacters = [];
    if (level === 'all') {
        availableCharacters = characters;
    } else {
        availableCharacters = charactersByLevel[level];
    }
    
    if (!availableCharacters || availableCharacters.length === 0) return;

    for (let i = 0; i < totalCharsNeeded; i++) {
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        selectedCharactersBatch.push(availableCharacters[randomIndex]);
    }
    
    renderBatchPreview();
}

function renderBatchPreview() {
    characterListDiv.innerHTML = '';
    const fontFamily = fontSelector.value;
    
    selectedCharactersBatch.forEach(char => {
        const charEl = document.createElement('div');
        charEl.className = 'preview-char-item';
        charEl.innerText = char;
        charEl.style.fontFamily = fontFamily;
        characterListDiv.appendChild(charEl);
    });
}

function drawPage(doc, charList, fontFamily) {
    const rows = 6;
    const cols = 5;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Calculate square cell size based on available space
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - 2 * margin;
    const cellSize = Math.min(availableWidth / cols, availableHeight / rows);
    
    // Center the grid
    const startX = margin + (availableWidth - cellSize * cols) / 2;
    const startY = margin + (availableHeight - cellSize * rows) / 2;

    for (let i = 0; i < rows; i++) {
        const character = charList[i];
        if (!character) continue;

        for (let j = 0; j < cols; j++) {
            const x = startX + j * cellSize;
            const y = startY + i * cellSize;

            // Draw grid lines (using native jsPDF drawing)
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);
            doc.rect(x, y, cellSize, cellSize);
            
            doc.setLineDash([1, 1], 0);
            doc.line(x, y + cellSize / 2, x + cellSize, y + cellSize / 2);
            doc.line(x + cellSize / 2, y, x + cellSize / 2, y + cellSize);
            doc.setLineDash([], 0);

            // Generate character image based on color and current font state
            const color = (j === 0) ? '#000000' : '#E5E5E5';
            const padding = 2;
            addCharacterImageToPdf(doc, character, color, fontFamily, 
                                 x + padding, y + padding, 
                                 cellSize - 2 * padding);
        }
    }
}

generatePdfBtn.addEventListener('click', () => {
    const pageCount = parseInt(pageCountInput.value, 10);
    const selectedFont = fontSelector.value;

    if (isNaN(pageCount) || pageCount < 1) {
        alert("Please enter a valid number of pages.");
        return;
    }
    
    if (selectedCharactersBatch.length === 0) {
        refreshCharacterBatch();
    }

    const doc = new jsPDF();
    if (fontStatus) fontStatus.innerHTML = "Generating PDF...";

    for (let p = 0; p < pageCount; p++) {
        if (p > 0) doc.addPage();
        // Take 6 characters for this page from the pre-selected batch
        const pageChars = selectedCharactersBatch.slice(p * 6, (p + 1) * 6);
        drawPage(doc, pageChars, selectedFont);
    }

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    doc.save(`chinese-trace_${timestamp}.pdf`);
    if (fontStatus) fontStatus.innerHTML = "Done! PDF Downloaded.";
});

refreshBatchBtn.addEventListener('click', () => {
    refreshCharacterBatch();
});

fontSelector.addEventListener('change', () => {
    updateStylePreview();
});

difficultySelector.addEventListener('change', () => {
    refreshCharacterBatch();
});

pageCountInput.addEventListener('change', () => {
    refreshCharacterBatch();
});

function init() {
    if (typeof characters === 'undefined' || characters.length === 0) {
        characterStatus.innerHTML = "Error: Library not loaded.";
        generatePdfBtn.disabled = true;
        refreshBatchBtn.disabled = true;
    } else {
        characterStatus.innerHTML = "Library loaded.";
        document.fonts.ready.then(() => {
            updateStylePreview();
            refreshCharacterBatch();
        });
        setTimeout(() => {
            updateStylePreview();
            if (selectedCharactersBatch.length === 0) refreshCharacterBatch();
        }, 1000);
    }
}

window.onload = init;