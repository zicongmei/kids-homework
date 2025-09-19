/**
 * Helper function to perform arithmetic calculations.
 * @param {number} num1 The first operand.
 * @param {string} op The operator (+, -, *, /).
 * @param {number} num2 The second operand.
 * @returns {number} The result of the operation.
 */
function calculate(num1, op, num2) {
    switch (op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num1 / num2; // Assumed to be integer division by generator
        default: return NaN;
    }
}

/**
 * Generates a single cross math problem grid.
 * The problem is a size x size grid of numbers, with horizontal and vertical operators and results.
 * Numbers and operators are adjusted to ensure integer and positive results where applicable (subtraction, division).
 * @param {number} size The dimension of the number grid (e.g., 3 for a 3x3 number grid).
 * @returns {object|null} An object containing the solved puzzle data (grid, operators, results) or null if generation fails.
 */
function generateCrossMathProblem(size) {
    const operators = ['+', '-', '*', '/'];
    const maxNum = 15; // Max value for initial numbers to keep results manageable

    let puzzleGrid = []; // Stores the actual numerical values (size x size)
    let hOps = []; // Stores horizontal operators (size x (size-1))
    let vOps = []; // Stores vertical operators ((size-1) x size)

    const MAX_GENERATION_ATTEMPTS = 5; // Max attempts to generate a valid puzzle
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
        let success = true;

        // Initialize puzzleGrid with random numbers (1 to maxNum)
        for (let i = 0; i < size; i++) {
            puzzleGrid[i] = [];
            for (let j = 0; j < size; j++) {
                puzzleGrid[i][j] = Math.floor(Math.random() * maxNum) + 1;
            }
        }

        // Generate horizontal operators and adjust numbers if needed
        for (let i = 0; i < size; i++) {
            hOps[i] = [];
            for (let j = 0; j < size - 1; j++) {
                let op;
                let num1 = puzzleGrid[i][j];
                let num2 = puzzleGrid[i][j+1];
                let opAttempts = 0;
                const MAX_OP_ATTEMPTS = 50;

                do {
                    op = operators[Math.floor(Math.random() * operators.length)];
                    opAttempts++;

                    if (op === '/') {
                        if (num2 === 0) { // Denominator cannot be zero
                            num2 = Math.floor(Math.random() * (maxNum - 1)) + 1; // Regenerate num2 (1 to maxNum-1)
                            puzzleGrid[i][j+1] = num2; // Update grid
                            continue; // Retry operator selection with new num2
                        }
                        if (num1 % num2 !== 0) {
                            // Make num1 a multiple of num2
                            num1 = num2 * (Math.floor(Math.random() * Math.floor(maxNum / num2)) + 1);
                            if (num1 === 0) num1 = num2; // Ensure num1 is not 0 after adjustment
                            puzzleGrid[i][j] = num1; // Update grid
                            continue; // Retry operator selection with new num1
                        }
                    } else if (op === '-') {
                        // Ensure result is positive or zero for subtraction
                        if (num1 < num2 && Math.random() < 0.7) { // 70% chance to adjust for positive result
                            // Adjust num1 to be larger than num2, or adjust num2 to be smaller than num1
                            num1 = num2 + (Math.floor(Math.random() * (maxNum - num2)) + 1);
                            puzzleGrid[i][j] = num1; // Update grid
                            continue; // Retry operator selection with new num1
                        }
                    }
                    break; // Operator is valid for current numbers, or numbers were adjusted to fit
                } while (opAttempts < MAX_OP_ATTEMPTS);

                if (opAttempts === MAX_OP_ATTEMPTS) {
                    success = false;
                    break;
                }
                hOps[i][j] = op;
            }
            if (!success) break;
        }
        if (!success) continue; // Restart outer loop if horizontal ops generation failed

        // Generate vertical operators and adjust numbers if needed
        // vOps is structured as vOps[operator_row_index][column_index]
        for (let i = 0; i < size - 1; i++) { // Loop through operator rows (0 to size-2)
            vOps[i] = []; // Initialize the array for this operator row
            for (let j = 0; j < size; j++) { // Loop through columns (0 to size-1)
                let op;
                let num1 = puzzleGrid[i][j];
                let num2 = puzzleGrid[i+1][j];
                let opAttempts = 0;
                const MAX_OP_ATTEMPTS = 50;

                do {
                    op = operators[Math.floor(Math.random() * operators.length)];
                    opAttempts++;

                    if (op === '/') {
                        if (num2 === 0) {
                            num2 = Math.floor(Math.random() * (maxNum - 1)) + 1;
                            puzzleGrid[i+1][j] = num2;
                            continue;
                        }
                        if (num1 % num2 !== 0) {
                            num1 = num2 * (Math.floor(Math.random() * Math.floor(maxNum / num2)) + 1);
                            if (num1 === 0) num1 = num2;
                            puzzleGrid[i][j] = num1;
                            continue;
                        }
                    } else if (op === '-') {
                        if (num1 < num2 && Math.random() < 0.7) {
                            num1 = num2 + (Math.floor(Math.random() * (maxNum - num2)) + 1);
                            puzzleGrid[i][j] = num1;
                            continue;
                        }
                    }
                    break;
                } while (opAttempts < MAX_OP_ATTEMPTS);

                if (opAttempts === MAX_OP_ATTEMPTS) {
                    success = false;
                    break;
                }
                vOps[i][j] = op;
            }
            if (!success) break;
        }
        if (!success) continue; // Restart outer loop if vertical ops generation failed

        // Calculate horizontal results
        let horizResults = [];
        for (let i = 0; i < size; i++) {
            let res = puzzleGrid[i][0];
            for (let j = 0; j < size - 1; j++) {
                res = calculate(res, hOps[i][j], puzzleGrid[i][j+1]);
            }
            horizResults[i] = res;
        }

        // Calculate vertical results
        let vertResults = [];
        for (let j = 0; j < size; j++) {
            let res = puzzleGrid[0][j];
            for (let i = 0; i < size - 1; i++) {
                res = calculate(res, vOps[i][j], puzzleGrid[i+1][j]);
            }
            vertResults[j] = res;
        }

        // If we reached here, puzzle generation was successful
        return {
            grid: puzzleGrid,
            hOps: hOps,
            vOps: vOps,
            horizResults: horizResults,
            vertResults: vertResults
        };
    }

    console.error("Failed to generate a valid puzzle after multiple attempts.");
    return null;
}

/**
 * Creates an HTML table element representing a cross math puzzle.
 * @param {object} puzzleData The solved puzzle data.
 * @param {number} size The dimension of the number grid.
 * @param {boolean} hideValues If true, some numbers/operators/results will be hidden to create a puzzle.
 * @returns {HTMLElement} The generated HTML div containing the table.
 */
function createPuzzleHtml(puzzleData, size, hideValues = true) {
    const { grid, hOps, vOps, horizResults, vertResults } = puzzleData;
    const containerDiv = document.createElement('div');
    const table = document.createElement('table');
    table.classList.add('puzzle-grid');

    // Determine how many values to hide
    const totalNumbers = size * size;
    const totalOperators = size * (size - 1) * 2; // Horizontal and Vertical
    const numToHide = Math.floor(totalNumbers * 0.3); // Hide about 30% of numbers
    const opsToHide = Math.floor(totalOperators * 0.2); // Hide about 20% of operators

    // Randomly select numbers to hide
    const hiddenNumbers = new Set();
    while (hideValues && hiddenNumbers.size < numToHide) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        hiddenNumbers.add(`${row},${col}`);
    }

    // Randomly select operators to hide
    const hiddenOps = new Set();
    while (hideValues && hiddenOps.size < opsToHide) {
        const isHorizontal = Math.random() < 0.5;
        if (isHorizontal) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * (size - 1));
            hiddenOps.add(`h_${row},${col}`);
        } else {
            const row = Math.floor(Math.random() * (size - 1));
            const col = Math.floor(Math.random() * size);
            hiddenOps.add(`v_${row},${col}`);
        }
    }

    // Total table dimensions: N numbers + (N-1) operators + 1 equals + 1 result
    const totalGridDim = size * 2 + 1; // e.g., for size=3, 2*3+1 = 7 (7x7 grid)

    for (let i = 0; i < totalGridDim; i++) { // Loop rows (0 to 2*size)
        const tr = document.createElement('tr');
        for (let j = 0; j < totalGridDim; j++) { // Loop columns (0 to 2*size)
            const td = document.createElement('td');

            const isNumberCell = i % 2 === 0 && j % 2 === 0;
            const isHorizontalOpCell = i % 2 === 0 && j % 2 !== 0 && j < totalGridDim - 2; // Before equals/result columns
            const isHorizontalEqualsCell = i % 2 === 0 && j === totalGridDim - 2; // Second to last column
            const isHorizontalResultCell = i % 2 === 0 && j === totalGridDim - 1; // Last column

            const isVerticalOpCell = i % 2 !== 0 && j % 2 === 0 && i < totalGridDim - 2; // Before equals/result rows
            const isVerticalEqualsCell = i === totalGridDim - 2 && j % 2 === 0; // Second to last row
            const isVerticalResultCell = i === totalGridDim - 1 && j % 2 === 0; // Last row
            
            // Cells that are not covered by the above specific types are fillers.

            if (isNumberCell) {
                const row = i / 2;
                const col = j / 2;
                if (row < size && col < size) { // Within the N x N grid of numbers
                    if (hideValues && hiddenNumbers.has(`${row},${col}`)) {
                        td.textContent = ''; // Empty for hidden numbers
                        td.classList.add('blank');
                    } else {
                        td.textContent = grid[row][col];
                    }
                } else { // Filler for cells like (2*size, 2*size)
                    td.classList.add('result-placeholder');
                }
            } else if (isHorizontalOpCell) {
                const row = i / 2;
                const opCol = (j - 1) / 2;
                if (row < size && opCol < size - 1) { // Ensure within bounds of hOps array
                    if (hideValues && hiddenOps.has(`h_${row},${opCol}`)) {
                        td.textContent = ''; // Empty for hidden operators
                        td.classList.add('blank', 'operator');
                    } else {
                        td.textContent = hOps[row][opCol];
                        td.classList.add('operator');
                    }
                } else {
                    td.classList.add('result-placeholder'); // Should not happen with current logic if bounds are right
                }
            } else if (isHorizontalEqualsCell) {
                const row = i / 2;
                if (row < size) { // Only for rows that correspond to a number row
                    td.textContent = '=';
                    td.classList.add('equals-sign-horizontal');
                } else { // E.g., cell at (2*size, 2*size-1)
                    td.classList.add('result-placeholder');
                }
            } else if (isHorizontalResultCell) {
                const row = i / 2;
                if (row < size) { // Only for rows that correspond to a number row
                    if (hideValues) {
                        td.textContent = ''; // Empty for hidden results
                        td.classList.add('blank', 'result');
                    } else {
                        td.textContent = horizResults[row];
                        td.classList.add('result');
                    }
                } else { // E.g., cell at (2*size, 2*size)
                    td.classList.add('result-placeholder');
                }
            } else if (isVerticalOpCell) {
                const opRow = (i - 1) / 2;
                const col = j / 2;
                if (opRow < size - 1 && col < size) { // Ensure within bounds of vOps array
                    if (hideValues && hiddenOps.has(`v_${opRow},${col}`)) {
                        td.textContent = ''; // Empty for hidden operators
                        td.classList.add('blank', 'operator');
                    } else {
                        td.textContent = vOps[opRow][col];
                        td.classList.add('operator');
                    }
                } else {
                    td.classList.add('result-placeholder'); // Should not happen
                }
            } else if (isVerticalEqualsCell) {
                const col = j / 2;
                if (col < size) { // Only for columns that correspond to a number column
                    td.textContent = '=';
                    td.classList.add('equals-sign-vertical');
                } else { // E.g., cell at (2*size-1, 2*size)
                    td.classList.add('result-placeholder');
                }
            } else if (isVerticalResultCell) {
                const col = j / 2;
                if (col < size) { // Only for columns that correspond to a number column
                    if (hideValues) {
                        td.textContent = ''; // Empty for hidden results
                        td.classList.add('blank', 'result');
                    } else {
                        td.textContent = vertResults[col];
                        td.classList.add('result');
                    }
                } else { // E.g., cell at (2*size, 2*size)
                    td.classList.add('result-placeholder');
                }
            } else { // All other cells are placeholders/fillers (e.g., operator intersection, corners of equals/result areas)
                td.textContent = '';
                td.classList.add('result-placeholder');
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    containerDiv.appendChild(table);
    return containerDiv;
}

document.addEventListener('DOMContentLoaded', () => {
    const numPagesInput = document.getElementById('numPages');
    const problemSizeInput = document.getElementById('problemSize');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const puzzlesContainer = document.getElementById('puzzlesContainer');

    generatePdfBtn.addEventListener('click', generatePdf);

    async function generatePdf() {
        const numPages = parseInt(numPagesInput.value, 10);
        const problemSize = parseInt(problemSizeInput.value, 10);

        if (isNaN(numPages) || numPages < 1) {
            alert('Please enter a valid number of pages (at least 1).');
            return;
        }
        if (isNaN(problemSize) || problemSize < 2 || problemSize > 5) {
            alert('Please enter a valid problem size (between 2 and 5).');
            return;
        }

        // Clear preview area
        puzzlesContainer.innerHTML = '';
        generatePdfBtn.disabled = true;
        generatePdfBtn.textContent = 'Generating...';

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'in',
            format: 'letter' // Page size is letter (8.5 x 11 inches)
        });

        // Create a hidden wrapper div for rendering each PDF page via html2canvas
        const pdfPageWrapper = document.createElement('div');
        pdfPageWrapper.classList.add('pdf-page-wrapper', 'print-visible');
        document.body.appendChild(pdfPageWrapper); // Append once, remove in finally block

        try {
            // Place 2 cross math puzzles per page
            const puzzlesPerPage = 2;
            let pageCount = 0;

            for (let i = 0; i < numPages; i++) {
                pageCount++;
                // Removed the title line: pdfPageWrapper.innerHTML = `<h2 class="puzzle-title-pdf">Cross Math Puzzle - Page ${pageCount}</h2>`;
                pdfPageWrapper.innerHTML = ''; // Clear content for the current page

                let pageGenerationFailed = false;
                for (let k = 0; k < puzzlesPerPage; k++) {
                    const puzzleData = generateCrossMathProblem(problemSize);
                    if (!puzzleData) {
                        alert("Failed to generate a puzzle for this page. Please try again or adjust settings.");
                        pageGenerationFailed = true;
                        break; // Stop trying to generate puzzles for this page
                    }
                    const puzzleHtml = createPuzzleHtml(puzzleData, problemSize, true); // true to hide values
                    puzzleHtml.classList.add('puzzle-instance-pdf');
                    pdfPageWrapper.appendChild(puzzleHtml);
                    
                    // Add to preview container as well (optional, but good for user feedback)
                    const previewPuzzleHtml = createPuzzleHtml(puzzleData, problemSize, true);
                    puzzlesContainer.appendChild(previewPuzzleHtml);
                }

                // If the very first page failed to generate any puzzles, throw an error to stop PDF generation.
                // Otherwise, log a warning and continue to render what was generated for the page.
                if (pageGenerationFailed && i === 0) {
                    throw new Error("Initial puzzle generation failed. Aborting PDF generation.");
                } else if (pageGenerationFailed) {
                    console.warn(`Puzzle generation failed for page ${pageCount}. Attempting to render partially generated page.`);
                }

                // Render the entire page wrapper to PDF
                await html2canvas(pdfPageWrapper, {
                    scale: 2, // Increase scale for higher resolution
                    useCORS: true,
                    logging: false // Disable logging
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = doc.internal.pageSize.getWidth();
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    const pageHeight = doc.internal.pageSize.getHeight();

                    let heightLeft = imgHeight;
                    let position = 0;

                    // Add the first part of the image
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    // If there's content spilling over, add new pages for it
                    while (heightLeft > 0) { // Changed condition from `>= -1` to `> 0` to prevent extra blank pages
                        position = heightLeft - imgHeight; // Calculate position for the next part of the image
                        doc.addPage();
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                });

                // Add new page for subsequent puzzles unless it's the last page
                // This `addPage` is for moving to the *next logical document page*, not for multi-page overflow
                if (i < numPages - 1) {
                    doc.addPage();
                }
            }

            doc.save(`cross_math_puzzles_size${problemSize}_${numPages}pages.pdf`);
        } 
        catch (error) {
            console.error("Error during PDF generation:", error);
            alert(`An error occurred during PDF generation: ${error.message}. Please try again.`);
        } finally {
            // Always reset button state and clean up the temporary PDF page wrapper
            generatePdfBtn.disabled = false;
            generatePdfBtn.textContent = 'Generate PDF';
            if (document.body.contains(pdfPageWrapper)) {
                document.body.removeChild(pdfPageWrapper);
            }
        }
    }
});