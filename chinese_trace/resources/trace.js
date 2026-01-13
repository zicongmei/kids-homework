window.jsPDF = window.jspdf.jsPDF;

const generatePdfBtn = document.getElementById('generate-pdf');
const pageCountInput = document.getElementById('page-count');
const fontStatus = document.getElementById('font-status');

function isFontAvailable(fontName) {
    try {
        const doc = new jsPDF();
        doc.setFont(fontName, 'normal');
        return true;
    } catch (e) {
        return false;
    }
}

function updateFontStatus() {
    if (!isFontAvailable('AR-PL-UKai-CN')) {
        const warning = `
            <strong>Warning:</strong> Chinese font not found. 
            The generated PDF will not display characters correctly.
            <br>
            Please follow these steps to install the font:
            <ol>
                <li>Download the font <a href="https://www.likefont.com/font/39838.html" target="_blank">AR PL UKai CN</a>.</li>
                <li>Go to the <a href="https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html" target="_blank">jsPDF font converter</a>.</li>
                <li>Select the downloaded .ttf file, and click 'Create'. This will generate a .js file.</li>
                <li>Save the .js file as 'AR-PL-UKai-CN-normal.js' in the 'chinese_trace/resources' directory.</li>
                <li>Add the following line to 'chinese_trace/index.html' before the 'trace.js' script tag: <br>
                    <code>&lt;script src="resources/AR-PL-UKai-CN-normal.js"&gt;&lt;/script&gt;</code>
                </li>
            </ol>
        `;
        fontStatus.innerHTML = warning;
    } else {
        fontStatus.innerHTML = "Chinese font loaded successfully.";
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

            doc.setDrawColor(200, 200, 200);
            doc.rect(x, y, cellWidth, cellHeight);

            doc.setFontSize(40);
            if (j === 0) {
                doc.setTextColor(0, 0, 0); // Black for the first character
            } else {
                doc.setTextColor(200, 200, 200); // Light gray for tracing
            }
            doc.text(character, x + cellWidth / 2, y + cellHeight / 2, { align: 'center', baseline: 'middle' });
        }
    }
}

generatePdfBtn.addEventListener('click', () => {
    if (!isFontAvailable('AR-PL-UKai-CN')) {
        alert("Chinese font not found. Please follow the instructions on the page to install the font before generating the PDF.");
        return;
    }

    const pageCount = parseInt(pageCountInput.value, 10);
    if (pageCount < 1) {
        alert("Please enter a valid number of pages.");
        return;
    }

    const doc = new jsPDF();
    doc.setFont('AR-PL-UKai-CN', 'normal');

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

    doc.save('chinese-trace-sheet.pdf');
});

updateFontStatus();
