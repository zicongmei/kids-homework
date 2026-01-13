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
    
    // Clear background (optional, but good for consistency)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    // Using a list of common Chinese fonts as fallback
    ctx.font = '160px "Noto Sans SC", "Microsoft YaHei", "SimHei", "STHeiti", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, 100, 100);
    return canvas.toDataURL('image/png');
}

function updateFontStatus() {
    if (fontStatus) {
        fontStatus.innerHTML = "Using browser rendering for Chinese characters. No additional font installation required.";
        fontStatus.style.color = "green";
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

            // Generate character image based on color
            const color = (j === 0) ? '#000000' : '#D3D3D3'; // Black for first, light gray for tracing
            const imgData = getCharacterImage(character, color);
            
            // Add the image to the PDF
            // We use a slightly smaller area to avoid overlapping with borders
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
            The file 'resources/characters.js' might be missing or empty.
        `;
        if (characterStatus) characterStatus.innerHTML = error;
        generatePdfBtn.disabled = true;
    } else {
        if (characterStatus) {
            characterStatus.innerHTML = "Chinese characters loaded successfully.";
            characterStatus.style.color = "green";
        }
        generatePdfBtn.disabled = false;
    }
}

updateFontStatus();
updateCharacterStatus();