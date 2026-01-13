window.jsPDF = window.jspdf.jsPDF;

const generatePdfBtn = document.getElementById('generate-pdf');
const pageCountInput = document.getElementById('page-count');
const fontSelector = document.getElementById('font-family');
const fontStatus = document.getElementById('font-status');
const characterStatus = document.getElementById('character-status');
const previewCanvas = document.getElementById('preview-canvas');

/**
 * Synchronously renders a character to a temporary canvas and adds it to the PDF as an image.
 */
function addCharacterImageToPdf(doc, character, color, fontFamily, x, y, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = 400; // Even higher resolution
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Fill white background for the image
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render text onto the canvas using the font that the browser has currently loaded
    ctx.fillStyle = color;
    ctx.font = `280px "${fontFamily}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2);
    
    // Convert to JPEG for the PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    doc.addImage(imgData, 'JPEG', x, y, width, height);
}

function updatePreview() {
    const character = '永';
    const fontFamily = fontSelector.value;
    
    const ctx = previewCanvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    ctx.fillStyle = '#000000';
    ctx.font = `160px "${fontFamily}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, previewCanvas.width / 2, previewCanvas.height / 2);
    
    if (fontStatus) fontStatus.innerHTML = `Previewing font: ${fontFamily}`;
}

function drawPage(doc, charList, fontFamily) {
    const rows = 6;
    const cols = 5;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const cellWidth = (pageWidth - 2 * margin) / cols;
    const cellHeight = (pageHeight - 2 * margin) / rows;

    for (let i = 0; i < rows; i++) {
        const character = charList[i];
        if (!character) continue;

        for (let j = 0; j < cols; j++) {
            const x = margin + j * cellWidth;
            const y = margin + i * cellHeight;

            // Draw grid lines (using native jsPDF drawing)
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);
            doc.rect(x, y, cellWidth, cellHeight);
            
            doc.setLineDash([1, 1], 0);
            doc.line(x, y + cellHeight / 2, x + cellWidth, y + cellHeight / 2);
            doc.line(x + cellWidth / 2, y, x + cellWidth / 2, y + cellHeight);
            doc.setLineDash([], 0);

            // Generate character image based on color and current font state
            const color = (j === 0) ? '#000000' : '#E5E5E5';
            const padding = 2;
            addCharacterImageToPdf(doc, character, color, fontFamily, 
                                 x + padding, y + padding, 
                                 cellWidth - 2 * padding, cellHeight - 2 * padding);
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

    const doc = new jsPDF();
    if (fontStatus) fontStatus.innerHTML = "Generating PDF...";

    for (let p = 0; p < pageCount; p++) {
        if (p > 0) doc.addPage();
        const selectedCharacters = [];
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            selectedCharacters.push(characters[randomIndex]);
        }
        drawPage(doc, selectedCharacters, selectedFont);
    }

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    doc.save(`chinese-trace_${timestamp}.pdf`);
    if (fontStatus) fontStatus.innerHTML = "Done! PDF Downloaded.";
});

fontSelector.addEventListener('change', () => {
    updatePreview();
});

function init() {
    if (typeof characters === 'undefined' || characters.length === 0) {
        characterStatus.innerHTML = "Error: Library not loaded.";
        generatePdfBtn.disabled = true;
    } else {
        characterStatus.innerHTML = "Character library loaded.";
        // Final attempt to ensure preview is correct once everything is loaded
        document.fonts.ready.then(() => {
            updatePreview();
        });
        // Fallback for slower browsers
        setTimeout(updatePreview, 1000);
    }
}

window.onload = init;
