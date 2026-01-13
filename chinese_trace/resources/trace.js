
window.jsPDF = window.jspdf.jsPDF;

// IMPORTANT: You need to download a Chinese font that supports the characters.
// We recommend the "AR PL UKai CN" font.
// Download it from a source like: https://www.likefont.com/font/39838.html
// and place the .ttf file in the `chinese_trace/resources` directory.
// You will then need to load this font in the code.
// For jsPDF, you need to convert the TTF font to a format that jsPDF can embed.
// you can do it from here https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html.
// then include the font file in index.html like <script src="AR-PL-UKai-CN-normal.js"></script>
// and set the font in the doc.setFont('AR-PL-UKai-CN');

const charSelect = document.getElementById('char-select');
const generatePdfBtn = document.getElementById('generate-pdf');
const previewArea = document.getElementById('preview-area');

function populateCharSelect() {
    characters.forEach(char => {
        const option = document.createElement('option');
        option.value = char;
        option.textContent = char;
        charSelect.appendChild(option);
    });
}

function generateTraceSheet(character) {
    const doc = new jsPDF();

    // Set a font that supports Chinese characters.
    // Replace 'AR-PL-UKai-CN' with the name of the font you added.
    try {
        doc.setFont('AR-PL-UKai-CN', 'normal');
    } catch (e) {
        doc.setFont('helvetica', 'normal');
        console.error("Font not found. Please follow the instructions in trace.js to add a Chinese font.");
        alert("Chinese font not found. The PDF will be generated with a default font and may not display correctly. Please see the console for instructions on how to add a font.");
    }


    const rows = 6;
    const cols = 5;
    const margin = 20;
    const cellWidth = (doc.internal.pageSize.getWidth() - 2 * margin) / cols;
    const cellHeight = (doc.internal.pageSize.getHeight() - 2 * margin) / rows;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = margin + j * cellWidth;
            const y = margin + i * cellHeight;

            doc.setDrawColor(200, 200, 200);
            doc.rect(x, y, cellWidth, cellHeight);

            if (j === 0) {
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(40);
                doc.text(character, x + cellWidth / 2, y + cellHeight / 2, { align: 'center', baseline: 'middle' });
            } else {
                doc.setTextColor(200, 200, 200);
                doc.setFontSize(40);
                doc.text(character, x + cellWidth / 2, y + cellHeight / 2, { align: 'center', baseline: 'middle' });
            }
        }
    }
    return doc;
}

generatePdfBtn.addEventListener('click', () => {
    const selectedChar = charSelect.value;
    const doc = generateTraceSheet(selectedChar);
    doc.save('chinese-trace-sheet.pdf');
});

populateCharSelect();
