window.jsPDF = window.jspdf.jsPDF;

const generatePdfBtn = document.getElementById('generate-pdf');
const pageCountInput = document.getElementById('page-count');
const fontStatus = document.getElementById('font-status');
const characterStatus = document.getElementById('character-status');

function getCharacterImage(character, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    // Using "Noto Serif SC" as primary and "SimSun" (宋体) as fallback
    // Most browsers on Windows will have "SimSun"
    // Mac has "STSong"
    ctx.font = '160px "Noto Serif SC", "SimSun", "宋体", "STSong", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, 100, 100);
    return canvas.toDataURL('image/png');
}

function updateFontStatus() {
    if (fontStatus) {
        fontStatus.innerHTML = "Using '宋体' (SimSun) style rendering for PDF characters.";
        fontStatus.style.color = "#27ae60";
    }
}

function drawPage(doc, characters) {
    const rows = 6;
    const cols = 5;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const cellWidth = (pageWidth - 2 * margin) / cols;
    const cellHeight = (pageHeight - 2 * margin) / rows;

    for (let i = 0; i < rows; i++) {
        const character = characters[i];
        if (!character) continue;

        for (let j = 0; j < cols; j++) {
            const x = margin + j * cellWidth;
            const y = margin + i * cellHeight;

            // Draw the grid box
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);
            doc.rect(x, y, cellWidth, cellHeight);
            
            // Optional: Draw a dashed cross inside the box for better tracing guidance
            doc.setLineDash([1, 1], 0);
            doc.line(x, y + cellHeight / 2, x + cellWidth, y + cellHeight / 2);
            doc.line(x + cellWidth / 2, y, x + cellWidth / 2, y + cellHeight);
            doc.setLineDash([], 0);

            // Generate character image based on color
            const color = (j === 0) ? '#000000' : '#E0E0E0'; // Black for first, very light gray for tracing
            const imgData = getCharacterImage(character, color);
            
            // Add the image to the PDF
            const padding = 2;
            doc.addImage(imgData, 'PNG', x + padding, y + padding, cellWidth - 2 * padding, cellHeight - 2 * padding);
        }
    }
}

generatePdfBtn.addEventListener('click', () => {
    const pageCount = parseInt(pageCountInput.value, 10);
    if (isNaN(pageCount) || pageCount < 1) {
        alert("Please enter a valid number of pages.");
        return;
    }

    const doc = new jsPDF();

    for (let p = 0; p < pageCount; p++) {
        if (p > 0) {
            doc.addPage();
        }
        const selectedCharacters = [];
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            selectedCharacters.push(characters[randomIndex]);
        }
        drawPage(doc, selectedCharacters);
    }

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    doc.save(`chinese-trace-sheet_${timestamp}.pdf`);
});

function updateCharacterStatus() {
    if (typeof characters === 'undefined' || characters.length === 0) {
        const error = `
            <strong>Error:</strong> Chinese characters not loaded. 
            'resources/characters.js' might be missing.
        `;
        if (characterStatus) characterStatus.innerHTML = error;
        generatePdfBtn.disabled = true;
    } else {
        if (characterStatus) {
            characterStatus.innerHTML = "Characters loaded successfully.";
            characterStatus.style.color = "#27ae60";
        }
        generatePdfBtn.disabled = false;
    }
}

updateFontStatus();
updateCharacterStatus();
