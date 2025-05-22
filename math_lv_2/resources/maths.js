// jsPDF will be available globally from the script tag in HTML
console.log("[maths.js] Script loading and initializing...");

// --- Problem Generation Logic ---

// Generates an addition problem where num1 + num2 < 100.
// Operands num1, num2 are at least 1.
// num1 is 1-98. num2 is 1 to (99-num1).
// This ensures num1 >= 1, num2 >= 1, and num1 + num2 <= 99 (i.e., < 100).
function generateAdditionProblem() {
    console.log("[generateAdditionProblem] Entry");
    // num1 from 1 to 98. This ensures num1 >= 1.
    // If num1 were 99, num2 would have to be 0 to satisfy num1+num2 < 100,
    // but num2 must be >= 1. So, max num1 is 98 (e.g., 98 + 1 = 99).
    const num1 = Math.floor(Math.random() * 98) + 1; // 1-98
    console.log(`[generateAdditionProblem] Generated num1: ${num1}`);

    // num2 from 1 up to (99 - num1).
    // (99 - num1) is the maximum value for num2 such that num1 + num2 <= 99.
    // The number of values in the range [1, K] is K.
    // So, num2 = Math.floor(Math.random() * (length_of_range)) + min_value.
    // Length of range [1, 99-num1] is (99-num1). Min value is 1.
    const num2 = Math.floor(Math.random() * (99 - num1)) + 1; // Ensures num2 >= 1 and num1 + num2 <= 99
    console.log(`[generateAdditionProblem] Generated num2: ${num2}`);
    const problem = { num1, num2, operator: '+' };
    console.log("[generateAdditionProblem] Returning problem:", problem);
    return problem;
}

// Generates a subtraction problem num1 - num2 where num1 >= num2,
// no borrowing is needed, the result is > 10, and operands are >= 1.
// num1 is 12-99. num2 is 1 to num1 (no borrow).
function generateSubtractionProblem() {
    console.log("[generateSubtractionProblem] Entry");
    let num1, num2, num1_ones, num1_tens, num2_ones, num2_tens;
    let attempts = 0;

    do {
        attempts++;
        // num1 must be at least 12 to potentially satisfy (num1 - num2 > 10) when num2 >= 1.
        // If num1 = 11, max (num1 - num2) with num2 >= 1 is (11 - 1) = 10. Not > 10.
        // So num1 must be >= 12. This also satisfies num1 >= 1.
        num1 = Math.floor(Math.random() * (99 - 12 + 1)) + 12; // Generates num1 from 12 to 99.

        num1_ones = num1 % 10;
        num1_tens = Math.floor(num1 / 10);

        // Generate num2 digits such that they are less than or equal to num1's digits
        // This ensures num1 >= num2 and no borrowing.
        num2_ones = Math.floor(Math.random() * (num1_ones + 1)); // 0 to num1_ones
        num2_tens = Math.floor(Math.random() * (num1_tens + 1)); // 0 to num1_tens

        num2 = num2_tens * 10 + num2_ones;
        
        if ((num1 - num2) <= 10 || num2 < 1) {
            console.log(`[generateSubtractionProblem] Retry ${attempts}: num1=${num1}, num2=${num2}. Condition not met: result > 10 (${num1 - num2 > 10}), num2 >= 1 (${num2 >= 1})`);
        }

    // Loop until result is greater than 10 (i.e. num1 - num2 >= 11) AND num2 is at least 1.
    } while ((num1 - num2) <= 10 || num2 < 1); 

    console.log(`[generateSubtractionProblem] Generated after ${attempts} attempts: num1=${num1}, num2=${num2}`);
    const problem = { num1, num2, operator: '-' };
    console.log("[generateSubtractionProblem] Returning problem:", problem);
    return problem;
}

// Generates a multiplication problem: 2-digit number * 1-digit number.
// num1 (2-digit) is 10-99. num2 (1-digit) is 2-9.
function generateMultiplicationProblem() {
    console.log("[generateMultiplicationProblem] Entry");
    const num1 = Math.floor(Math.random() * 90) + 10; // Generates num1 from 10 to 99
    console.log(`[generateMultiplicationProblem] Generated num1: ${num1}`);
    const num2 = Math.floor(Math.random() * 8) + 2;   // Generates num2 from 2 to 9
    console.log(`[generateMultiplicationProblem] Generated num2: ${num2}`);
    const problem = { num1, num2, operator: '×' }; // Using '×' (multiplication sign)
    console.log("[generateMultiplicationProblem] Returning problem:", problem);
    return problem;
}

// Generates a 9x9 multiplication table problem (randomly).
// num1 and num2 are from 1 to 9.
// This function is not used by generate9x9Homework anymore but kept for potential other uses.
function generate9x9MultiplicationProblem() {
    console.log("[generate9x9MultiplicationProblem] Entry");
    const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
    console.log(`[generate9x9MultiplicationProblem] Generated num1: ${num1}, num2: ${num2}`);
    const problem = { num1, num2, operator: '×' }; // Using '×' (multiplication sign)
    console.log("[generate9x9MultiplicationProblem] Returning problem:", problem);
    return problem;
}


// --- PDF Generation Logic ---

const PROBLEMS_PER_PAGE = 12; // For Add/Sub and 2-digit x 1-digit Multiply
const NUM_COLS = 3; // For Add/Sub and 2-digit x 1-digit Multiply
const NUM_ROWS = 4; // For Add/Sub and 2-digit x 1-digit Multiply
const MAX_SUBTRACTION_PROBLEMS_PER_PAGE = 4;

// Letter paper dimensions in points (1 inch = 72 points)
// These are for PORTRAIT orientation
const PAGE_WIDTH_PT = 8.5 * 72; // 612
const PAGE_HEIGHT_PT = 11 * 72; // 792
const MARGIN_PT = 0.75 * 72;    // 0.75 inch margin (54 points)

// Content area for PORTRAIT orientation
const CONTENT_WIDTH_PT = PAGE_WIDTH_PT - 2 * MARGIN_PT;
const CONTENT_HEIGHT_PT = PAGE_HEIGHT_PT - 2 * MARGIN_PT;

// Cell dimensions for PORTRAIT Add/Sub and 2-digit x 1-digit Multiply
const CELL_WIDTH_PT = CONTENT_WIDTH_PT / NUM_COLS;
const CELL_HEIGHT_PT = CONTENT_HEIGHT_PT / NUM_ROWS;

const FONT_SIZE_PROBLEM = 40; // Font size for numbers and operator in vertical Add/Sub/Multiply
const LINE_SPACING_FACTOR = 1.3; // Factor to determine line height from font size
const LINE_SPACING = FONT_SIZE_PROBLEM * LINE_SPACING_FACTOR;

const PROBLEM_PADDING_RIGHT = CELL_WIDTH_PT * 0.2; // Right padding within cell for problem alignment
const OPERATOR_PADDING_LEFT = FONT_SIZE_PROBLEM * 0.5; // Padding left of operator

console.log("[maths.js] PDF Layout Constants Initialized:", {
    PROBLEMS_PER_PAGE,
    NUM_COLS,
    NUM_ROWS,
    MAX_SUBTRACTION_PROBLEMS_PER_PAGE,
    PAGE_WIDTH_PT,
    PAGE_HEIGHT_PT,
    MARGIN_PT,
    CONTENT_WIDTH_PT,
    CONTENT_HEIGHT_PT,
    CELL_WIDTH_PT,
    CELL_HEIGHT_PT,
    FONT_SIZE_PROBLEM,
    LINE_SPACING_FACTOR,
    LINE_SPACING,
    PROBLEM_PADDING_RIGHT,
    OPERATOR_PADDING_LEFT
});

function generateHomework() {
    console.log("[generateHomework] Entry");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p', // portrait
        unit: 'pt',
        format: 'letter'
    });
    console.log("[generateHomework] jsPDF instance created.");

    const numPagesInput = document.getElementById('numPagesAddSub'); // Changed ID
    const numPages = parseInt(numPagesInput.value) || 1;
    console.log(`[generateHomework] Number of pages requested: ${numPages}`);

    doc.setFont('courier', 'normal'); // Monospaced font for good alignment
    console.log("[generateHomework] Font set to courier.");

    for (let p = 0; p < numPages; p++) {
        console.log(`[generateHomework] Starting page ${p + 1} of ${numPages}`);
        if (p > 0) {
            doc.addPage();
            console.log(`[generateHomework] Added new page ${p + 1}`);
        }
        let subtractionProblemCountThisPage = 0; // Reset for each page
        console.log(`[generateHomework] Initial subtractionProblemCountThisPage for page ${p + 1}: ${subtractionProblemCountThisPage}`);
        
        doc.setFontSize(FONT_SIZE_PROBLEM); // Reset font size for problems

        for (let i = 0; i < PROBLEMS_PER_PAGE; i++) {
            console.log(`[generateHomework] Page ${p + 1}, Problem ${i + 1}`);
            let problem;

            if (subtractionProblemCountThisPage < MAX_SUBTRACTION_PROBLEMS_PER_PAGE) {
                // Limit not reached, 50/50 chance for addition or subtraction
                if (Math.random() < 0.5) { // 50% chance for addition
                    console.log(`[generateHomework] Generating addition problem (subtraction count: ${subtractionProblemCountThisPage})`);
                    problem = generateAdditionProblem();
                } else { // 50% chance for subtraction
                    console.log(`[generateHomework] Generating subtraction problem (subtraction count: ${subtractionProblemCountThisPage})`);
                    problem = generateSubtractionProblem();
                    subtractionProblemCountThisPage++;
                    console.log(`[generateHomework] Incremented subtractionProblemCountThisPage to: ${subtractionProblemCountThisPage}`);
                }
            } else {
                // Subtraction limit reached, force addition
                console.log(`[generateHomework] Subtraction limit reached (${subtractionProblemCountThisPage}), forcing addition problem.`);
                problem = generateAdditionProblem();
            }
            console.log(`[generateHomework] Problem ${i + 1}: ${problem.num1} ${problem.operator} ${problem.num2}`);

            const row = Math.floor(i / NUM_COLS);
            const col = i % NUM_COLS;
            console.log(`[generateHomework] Problem ${i + 1} at row ${row}, col ${col}`);

            // Top-left corner of the current cell
            const cellX = MARGIN_PT + col * CELL_WIDTH_PT;
            const cellY = MARGIN_PT + row * CELL_HEIGHT_PT;
            console.log(`[generateHomework] Cell coordinates: X=${cellX}, Y=${cellY}`);

            // --- Draw problem in vertical format ---
            const s_num1 = String(problem.num1);
            const s_num2 = String(problem.num2);

            // X-coordinate for the right edge of the numbers (for right-alignment)
            const rightAlignX = cellX + CELL_WIDTH_PT - PROBLEM_PADDING_RIGHT;

            // Max width of a two-digit number string (e.g., "99") for consistent spacing
            const twoDigitWidth = doc.getTextWidth("99"); 

            // Y-coordinate for the baseline of the first number (num1)
            let yPos = cellY + (CELL_HEIGHT_PT - (3 * LINE_SPACING)) / 2 + LINE_SPACING;
            console.log(`[generateHomework] Drawing num1: "${s_num1}" at X=${rightAlignX} (aligned right), Y=${yPos}`);

            // Draw num1
            doc.text(s_num1, rightAlignX, yPos, { align: 'right' });

            // Move to next line for num2 and operator
            yPos += LINE_SPACING;
            console.log(`[generateHomework] New yPos for num2/operator: ${yPos}`);

            // Draw num2
            console.log(`[generateHomework] Drawing num2: "${s_num2}" at X=${rightAlignX} (aligned right), Y=${yPos}`);
            doc.text(s_num2, rightAlignX, yPos, { align: 'right' });

            // Draw operator, aligned to the left of where a two-digit number would start
            const operatorXPos = rightAlignX - twoDigitWidth - OPERATOR_PADDING_LEFT;
            console.log(`[generateHomework] Drawing operator: "${problem.operator}" at X=${operatorXPos}, Y=${yPos}`);
            doc.text(problem.operator, operatorXPos, yPos); 

            // Y-coordinate for the horizontal line below num2
            const lineYPos = yPos + FONT_SIZE_PROBLEM * 0.3; 
            
            doc.setLineWidth(0.75); // Line thickness
            
            const linePaddingLeftOfOperator = FONT_SIZE_PROBLEM * 0.2; 
            const lineStartX = operatorXPos - linePaddingLeftOfOperator;
            console.log(`[generateHomework] Drawing line from X1=${lineStartX}, Y1=${lineYPos} to X2=${rightAlignX}, Y2=${lineYPos}`);
            doc.line(lineStartX, lineYPos, rightAlignX, lineYPos);
        }
        console.log(`[generateHomework] Finished page ${p + 1}`);
    }

    doc.save('kids_add_sub_homework.pdf'); // Changed filename
    console.log("[generateHomework] PDF 'kids_add_sub_homework.pdf' saved. Exiting.");
}

function generateMultiplicationHomework() {
    console.log("[generateMultiplicationHomework] Entry");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'letter'
    });
    console.log("[generateMultiplicationHomework] jsPDF instance created.");

    const numPagesInput = document.getElementById('numPagesMultiply'); // Use ID for multiplication
    const numPages = parseInt(numPagesInput.value) || 1;
    console.log(`[generateMultiplicationHomework] Number of pages requested: ${numPages}`);

    doc.setFont('courier', 'normal'); // Monospaced font for good alignment
    console.log("[generateMultiplicationHomework] Font set to courier.");

    for (let p = 0; p < numPages; p++) {
        console.log(`[generateMultiplicationHomework] Starting page ${p + 1} of ${numPages}`);
        if (p > 0) {
            doc.addPage();
            console.log(`[generateMultiplicationHomework] Added new page ${p + 1}`);
        }
        
        doc.setFontSize(FONT_SIZE_PROBLEM); // Reset font size for problems

        for (let i = 0; i < PROBLEMS_PER_PAGE; i++) {
            console.log(`[generateMultiplicationHomework] Page ${p + 1}, Problem ${i + 1}`);
            const problem = generateMultiplicationProblem(); // Generate a multiplication problem
            console.log(`[generateMultiplicationHomework] Problem ${i + 1}: ${problem.num1} ${problem.operator} ${problem.num2}`);

            const row = Math.floor(i / NUM_COLS);
            const col = i % NUM_COLS;
            console.log(`[generateMultiplicationHomework] Problem ${i + 1} at row ${row}, col ${col}`);

            // Top-left corner of the current cell
            const cellX = MARGIN_PT + col * CELL_WIDTH_PT;
            const cellY = MARGIN_PT + row * CELL_HEIGHT_PT;
            console.log(`[generateMultiplicationHomework] Cell coordinates: X=${cellX}, Y=${cellY}`);

            // --- Draw problem in vertical format ---
            const s_num1 = String(problem.num1); // This will be the 2-digit number
            const s_num2 = String(problem.num2); // This will be the 1-digit number

            // X-coordinate for the right edge of the numbers (for right-alignment)
            const rightAlignX = cellX + CELL_WIDTH_PT - PROBLEM_PADDING_RIGHT;

            // Width of a two-digit number string (e.g., "99") for consistent spacing of operator
            const twoDigitWidth = doc.getTextWidth("99"); 

            // Y-coordinate for the baseline of the first number (num1)
            // This calculation centers the 3 "lines" (num1, op+num2, -----) vertically within the cell.
            let yPos = cellY + (CELL_HEIGHT_PT - (3 * LINE_SPACING)) / 2 + LINE_SPACING;
            console.log(`[generateMultiplicationHomework] Drawing num1: "${s_num1}" at X=${rightAlignX} (aligned right), Y=${yPos}`);

            // Draw num1 (the 2-digit number, on top)
            doc.text(s_num1, rightAlignX, yPos, { align: 'right' });

            // Move to next line for num2 and operator
            yPos += LINE_SPACING;
            console.log(`[generateMultiplicationHomework] New yPos for num2/operator: ${yPos}`);

            // Draw num2 (the 1-digit number)
            // Right-align s_num2 so it aligns with the ones digit of s_num1
            console.log(`[generateMultiplicationHomework] Drawing num2: "${s_num2}" at X=${rightAlignX} (aligned right), Y=${yPos}`);
            doc.text(s_num2, rightAlignX, yPos, { align: 'right' });

            // Draw operator '×'
            // Positioned to the left of the column where num1's tens digit is.
            // This uses twoDigitWidth as a reference for the width of num1.
            const operatorXPos = rightAlignX - twoDigitWidth - OPERATOR_PADDING_LEFT;
            console.log(`[generateMultiplicationHomework] Drawing operator: "${problem.operator}" at X=${operatorXPos}, Y=${yPos}`);
            doc.text(problem.operator, operatorXPos, yPos); 

            // Y-coordinate for the horizontal line below num2
            const lineYPos = yPos + FONT_SIZE_PROBLEM * 0.3; // Small gap below baseline of num2
            
            doc.setLineWidth(0.75); // Line thickness
            
            // Line should span from left of operator to right of numbers
            const linePaddingLeftOfOperator = FONT_SIZE_PROBLEM * 0.2; 
            const lineStartX = operatorXPos - linePaddingLeftOfOperator;
            console.log(`[generateMultiplicationHomework] Drawing line from X1=${lineStartX}, Y1=${lineYPos} to X2=${rightAlignX}, Y2=${lineYPos}`);
            doc.line(lineStartX, lineYPos, rightAlignX, lineYPos);
        }
        console.log(`[generateMultiplicationHomework] Finished page ${p + 1}`);
    }

    doc.save('kids_multiplication_homework.pdf'); // Save with a new filename
    console.log("[generateMultiplicationHomework] PDF 'kids_multiplication_homework.pdf' saved. Exiting.");
}


function generate9x9Homework() {
    console.log("[generate9x9Homework] Entry");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'l', // Landscape orientation
        unit: 'pt',
        format: 'letter'
    });
    console.log("[generate9x9Homework] jsPDF instance created in LANDSCAPE mode.");

    const numPagesInput = document.getElementById('numPages9x9');
    const numPages = parseInt(numPagesInput.value) || 1;
    console.log(`[generate9x9Homework] Number of pages requested: ${numPages}`);

    doc.setFont('courier', 'normal'); // Monospaced font
    console.log("[generate9x9Homework] Font set to courier.");

    // --- LANDSCAPE Page Layout Constants for 9x9 ---
    // Effective page dimensions for landscape (swapping original width and height)
    const EFFECTIVE_PAGE_WIDTH_PT = PAGE_HEIGHT_PT; // Uses global portrait PAGE_HEIGHT_PT (792pt) as width
    const EFFECTIVE_PAGE_HEIGHT_PT = PAGE_WIDTH_PT;  // Uses global portrait PAGE_WIDTH_PT (612pt) as height
    
    // Content area for LANDSCAPE (MARGIN_PT is global and reused)
    const CONTENT_WIDTH_LANDSCAPE_PT = EFFECTIVE_PAGE_WIDTH_PT - 2 * MARGIN_PT; // 792 - 108 = 684
    const CONTENT_HEIGHT_LANDSCAPE_PT = EFFECTIVE_PAGE_HEIGHT_PT - 2 * MARGIN_PT; // 612 - 108 = 504

    // Generate all 81 unique 9x9 problems in order
    let all9x9Problems = [];
    for (let r = 1; r <= 9; r++) {
        for (let c = 1; c <= 9; c++) {
            all9x9Problems.push({ num1: r, num2: c, operator: '×' });
        }
    }
    const PROBLEMS_TO_DISPLAY_ON_PAGE = all9x9Problems.length; // 81 problems

    // Layout constants for fitting 81 problems on a landscape page
    const FONT_SIZE_9X9 = 12; // Adjusted Font size for "N x N ="
    const ANSWER_LINE_LENGTH_PT = FONT_SIZE_9X9 * 2.0; // Adjusted Length of the blank line for the answer
    
    const NUM_COLS_9X9 = 9; // Number of columns for problems (9 columns)
    const NUM_ROWS_9X9 = 9; // Number of rows for problems (9 rows)
    // const NUM_ROWS_9X9 = Math.ceil(PROBLEMS_TO_DISPLAY_ON_PAGE / NUM_COLS_9X9); // This will be 81/9 = 9

    const CELL_WIDTH_9X9 = CONTENT_WIDTH_LANDSCAPE_PT / NUM_COLS_9X9;
    const ALLOCATED_ROW_HEIGHT_9X9 = CONTENT_HEIGHT_LANDSCAPE_PT / NUM_ROWS_9X9;

    console.log("[generate9x9Homework] Landscape Layout:", {
        EFFECTIVE_PAGE_WIDTH_PT, EFFECTIVE_PAGE_HEIGHT_PT,
        CONTENT_WIDTH_LANDSCAPE_PT, CONTENT_HEIGHT_LANDSCAPE_PT,
        FONT_SIZE_9X9, ANSWER_LINE_LENGTH_PT,
        NUM_COLS_9X9, NUM_ROWS_9X9,
        CELL_WIDTH_9X9: CELL_WIDTH_9X9.toFixed(2), 
        ALLOCATED_ROW_HEIGHT_9X9: ALLOCATED_ROW_HEIGHT_9X9.toFixed(2)
    });

    for (let p = 0; p < numPages; p++) {
        console.log(`[generate9x9Homework] Starting page ${p + 1} of ${numPages}`);
        if (p > 0) {
            doc.addPage({ orientation: 'l' }); // Ensure new pages are also landscape
            console.log(`[generate9x9Homework] Added new landscape page ${p + 1}`);
        }
        
        doc.setFontSize(FONT_SIZE_9X9);

        for (let i = 0; i < PROBLEMS_TO_DISPLAY_ON_PAGE; i++) {
            const problem = all9x9Problems[i]; // Get problem from the pre-ordered list
            // console.log(`[generate9x9Homework] Problem ${i + 1}: ${problem.num1} ${problem.operator} ${problem.num2}`);

            const problemText = `${problem.num1}${problem.operator}${problem.num2} = `; // MODIFIED: Reduced space around operator
            const problemTextWidth = doc.getTextWidth(problemText);
            const totalProblemBlockWidth = problemTextWidth + ANSWER_LINE_LENGTH_PT;

            const colIndex = i % NUM_COLS_9X9;
            const rowIndex = Math.floor(i / NUM_COLS_9X9);

            // Calculate X position: Start of cell + centering adjustment for the "problem = ___" block
            const cellStartX = MARGIN_PT + (colIndex * CELL_WIDTH_9X9);
            // The (CELL_WIDTH_9X9 - totalProblemBlockWidth) / 2 part will increase due to smaller totalProblemBlockWidth,
            // thus increasing space on either side of the problem content within its cell, effectively spacing out problems.
            const xPos = cellStartX + (CELL_WIDTH_9X9 - totalProblemBlockWidth) / 2;

            // Calculate Y position for the text baseline (vertically centered in allocated row space)
            const rowTopEdgeY = MARGIN_PT + (rowIndex * ALLOCATED_ROW_HEIGHT_9X9);
            const yTextBaseline = rowTopEdgeY + (ALLOCATED_ROW_HEIGHT_9X9 / 2) + (FONT_SIZE_9X9 / 3.5); // Fine-tune divisor for vertical centering

            // console.log(`[generate9x9Homework] Page ${p+1}, P${i+1} (r:${rowIndex},c:${colIndex}) -> x:${xPos.toFixed(2)}, y:${yTextBaseline.toFixed(2)}`);
            
            doc.text(problemText, xPos, yTextBaseline);

            // Draw the line for the answer
            const lineStartX = xPos + problemTextWidth;
            const lineEndX = lineStartX + ANSWER_LINE_LENGTH_PT;
            const lineY = yTextBaseline + (FONT_SIZE_9X9 * 0.15); // Place line slightly below text baseline (adjust as needed)
            
            doc.setLineWidth(0.75);
            doc.line(lineStartX, lineY, lineEndX, lineY);
            // console.log(`[generate9x9Homework] Line from (${lineStartX.toFixed(2)},${lineY.toFixed(2)}) to (${lineEndX.toFixed(2)},${lineY.toFixed(2)})`);
        }
        console.log(`[generate9x9Homework] Finished page ${p + 1}`);
    }

    doc.save('kids_9x9_multiplication_homework.pdf');
    console.log("[generate9x9Homework] PDF 'kids_9x9_multiplication_homework.pdf' saved. Exiting.");
}


console.log("[maths.js] Script fully loaded and functions defined.");