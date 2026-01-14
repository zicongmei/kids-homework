window.jsPDF = window.jspdf.jsPDF;

const generatePdfBtn = document.getElementById('generate-pdf');
const refreshBatchBtn = document.getElementById('refresh-batch');
const pageCountInput = document.getElementById('page-count');
const includePinyinCheckbox = document.getElementById('include-pinyin');
const includeEnglishCheckbox = document.getElementById('include-english');
const fontSelector = document.getElementById('font-family');
const customFontContainer = document.getElementById('custom-font-container');
const customFontInput = document.getElementById('custom-font-name');
const difficultySelector = document.getElementById('difficulty-level');
const fontStatus = document.getElementById('font-status');
const characterStatus = document.getElementById('character-status');
const previewCanvas = document.getElementById('preview-canvas');
const characterListDiv = document.getElementById('character-list');

let selectedCharactersBatch = [];

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

/**
 * Renders text (Pinyin/English) to a canvas and adds it to the PDF.
 * This ensures accented characters (Pinyin) are rendered correctly.
 */
function addTextImageToPdf(doc, text, x, y, maxWidth, maxHeight, fontSize, fontWeight = 'normal', color = '#646464') {
    if (!text) return;
    const canvas = document.createElement('canvas');
    const scale = 2; // High resolution
    canvas.width = maxWidth * scale;
    canvas.height = maxHeight * scale;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize * scale}px helvetica, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Simple wrap text if needed or just fit
    ctx.fillText(text, 2, canvas.height / 2, canvas.width - 4);
    
    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    doc.addImage(imgData, 'JPEG', x, y - maxHeight / 2, maxWidth, maxHeight);
}

function getSelectedFontFamily() {
    if (fontSelector.value === 'other') {
        return customFontInput.value || 'cursive';
    }
    return fontSelector.value;
}

function updateStylePreview() {
    const fontFamily = getSelectedFontFamily();
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
    const level = difficultySelector.value;
    selectedCharactersBatch = []; // Clear previous batch
    
    let baseAvailableCharacters = [];
    if (level === 'all') {
        baseAvailableCharacters = characters;
    } else {
        baseAvailableCharacters = charactersByLevel[level];
    }
    
    if (!baseAvailableCharacters || baseAvailableCharacters.length === 0) {
        characterStatus.innerHTML = "Error: No characters available for selected difficulty.";
        return;
    }

    // Generate unique characters for each page
    for (let p = 0; p < pageCount; p++) {
        let currentPageCharacters = [];
        // Create a copy of the available characters for this page's selection process
        let currentPageUniquePool = [...baseAvailableCharacters]; 

        for (let i = 0; i < 6; i++) { // Each page has 6 character slots
            if (currentPageUniquePool.length === 0) {
                // If the pool for this page is exhausted before 6 unique characters are picked,
                // it means there aren't enough unique characters in the selected library to fill this page uniquely.
                // In this case, we'll stop adding characters to this page and proceed with fewer than 6,
                // or you could choose to re-populate currentPageUniquePool from baseAvailableCharacters
                // to fill the remaining slots, which would introduce repeats *within this page*.
                // For "no repeated character in each page", we prioritize uniqueness and stop.
                // Given the typical size of Chinese character sets, this is unlikely for 6 characters.
                console.warn(`Not enough unique characters from the selected library (${level}) to fill page ${p+1} completely. Only ${currentPageCharacters.length} unique characters added.`);
                break; 
            }
            const randomIndex = Math.floor(Math.random() * currentPageUniquePool.length);
            const charObj = currentPageUniquePool[randomIndex];
            currentPageCharacters.push(charObj);
            currentPageUniquePool.splice(randomIndex, 1); // Remove to ensure uniqueness on THIS page
        }
        selectedCharactersBatch.push(...currentPageCharacters);
    }
    
    renderBatchPreview();
}

function renderBatchPreview() {
    characterListDiv.innerHTML = '';
    const fontFamily = getSelectedFontFamily();
    
    selectedCharactersBatch.forEach(charObj => {
        const charEl = document.createElement('div');
        charEl.className = 'preview-char-item';
        charEl.innerText = charObj.char;
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
    
    const showPinyin = includePinyinCheckbox.checked;
    const showEnglish = includeEnglishCheckbox.checked;
    const showSideText = showPinyin || showEnglish;

    // Calculate square cell size based on available space
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - 2 * margin;
    
    // If we show side text, we allocate extra space on the left
    const colsForLayout = showSideText ? (cols + 1.5) : cols;
    const cellSize = Math.min(availableWidth / colsForLayout, availableHeight / rows);
    
    const meaningWidth = showSideText ? cellSize * 1.5 : 0;
    const totalWidth = meaningWidth + cellSize * cols;

    // Center the grid
    const startX = margin + (availableWidth - totalWidth) / 2;
    const startY = margin + (availableHeight - cellSize * rows) / 2;

    for (let i = 0; i < rows; i++) {
        const charObj = charList[i];
        if (!charObj) continue; // Skip if there aren't 6 characters for this page

        if (showSideText) {
            const textX = startX;
            const textY = startY + i * cellSize + cellSize / 2;
            const textMaxW = meaningWidth - 5;
            
            if (showPinyin && showEnglish) {
                // Both: Pinyin top, English bottom
                addTextImageToPdf(doc, charObj.pinyin, textX, textY - cellSize / 6, textMaxW, cellSize / 3, 10, 'bold');
                addTextImageToPdf(doc, charObj.meaning, textX, textY + cellSize / 6, textMaxW, cellSize / 3, 8);
            } else if (showPinyin) {
                // Pinyin only: Centered vertically
                addTextImageToPdf(doc, charObj.pinyin, textX, textY, textMaxW, cellSize / 2, 12, 'bold');
            } else if (showEnglish) {
                // English only: Centered vertically
                addTextImageToPdf(doc, charObj.meaning, textX, textY, textMaxW, cellSize / 2, 10);
            }
        }

        for (let j = 0; j < cols; j++) {
            const x = startX + meaningWidth + j * cellSize;
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
            addCharacterImageToPdf(doc, charObj.char, color, fontFamily, 
                                 x + padding, y + padding, 
                                 cellSize - 2 * padding);
        }
    }
}

generatePdfBtn.addEventListener('click', () => {
    const pageCount = parseInt(pageCountInput.value, 10);
    const selectedFont = getSelectedFontFamily();

    if (isNaN(pageCount) || pageCount < 1) {
        alert("Please enter a valid number of pages.");
        return;
    }
    
    if (selectedCharactersBatch.length === 0) {
        refreshCharacterBatch(); // Ensure characters are generated if not already
    }
    if (selectedCharactersBatch.length === 0) {
        alert("No characters available to generate. Please check difficulty level.");
        return;
    }

    const doc = new jsPDF();
    if (fontStatus) fontStatus.innerHTML = "Generating PDF...";

    for (let p = 0; p < pageCount; p++) {
        if (p > 0) doc.addPage();
        // Take 6 characters for this page from the pre-selected batch.
        // If the batch has fewer than 6 characters for the last page, it will take what's left.
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
    if (fontSelector.value === 'other') {
        customFontContainer.style.display = 'block';
    } else {
        customFontContainer.style.display = 'none';
    }
    updateStylePreview();
});

customFontInput.addEventListener('input', () => {
    updateStylePreview();
});

difficultySelector.addEventListener('change', () => {
    refreshCharacterBatch();
});

pageCountInput.addEventListener('change', () => {
    refreshCharacterBatch();
});

includePinyinCheckbox.addEventListener('change', () => {
    updateStylePreview();
});

includeEnglishCheckbox.addEventListener('change', () => {
    updateStylePreview();
});

function init() {
    if (typeof characters === 'undefined' || characters.length === 0) {
        characterStatus.innerHTML = "Error: Character library not loaded.";
        generatePdfBtn.disabled = true;
        refreshBatchBtn.disabled = true;
    } else {
        characterStatus.innerHTML = "Library loaded.";
        document.fonts.ready.then(() => {
            updateStylePreview();
            refreshCharacterBatch();
        });
        // Fallback for fonts not immediately ready or if document.fonts.ready doesn't fire as expected
        setTimeout(() => {
            updateStylePreview();
            if (selectedCharactersBatch.length === 0) refreshCharacterBatch();
        }, 1000);
    }
}

window.onload = init;