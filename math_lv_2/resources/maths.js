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

// Generates a subtraction problem num1 - num2 where num1 > num2 (result > 0)
// and no borrowing is needed. Operands are >= 1.
// num1 is 10-99. num2 is generated to meet conditions.
function generateSubtractionProblemNoBorrowing() {
    console.log("[generateSubtractionProblemNoBorrowing] Entry");
    let num1, num2, num1_ones, num1_tens, num2_ones, num2_tens;
    let attempts = 0;

    do {
        attempts++;
        // num1 from 10 to 99 to ensure it's a 2-digit number for meaningful tens/ones separation
        num1 = Math.floor(Math.random() * 90) + 10; // 10-99

        num1_ones = num1 % 10;
        num1_tens = Math.floor(num1 / 10);

        // Generate num2 digits such that they are less than or equal to num1's digits
        // This inherently ensures num1 >= num2 and no borrowing.
        num2_ones = Math.floor(Math.random() * (num1_ones + 1)); // 0 to num1_ones
        num2_tens = Math.floor(Math.random() * (num1_tens + 1)); // 0 to num1_tens

        num2 = num2_tens * 10 + num2_ones;
        
        // Loop until num1 > num2 (result > 0) AND num2 is at least 1.
        // If num1 = num2 or num2 = 0, problem is not valid for this type.
    } while (num1 <= num2 || num2 < 1); 

    console.log(`[generateSubtractionProblemNoBorrowing] Generated after ${attempts} attempts: num1=${num1}, num2=${num2}, result=${num1-num2}`);
    const problem = { num1, num2, operator: '-' };
    console.log("[generateSubtractionProblemNoBorrowing] Returning problem:", problem);
    return problem;
}

// Generates a subtraction problem num1 - num2 where num1 > num2 (result > 0)
// and borrowing is needed from the tens place. Operands are >= 1.
// num1 is 10-99. num2 is 1-99.
function generateSubtractionProblemWithBorrowing() {
    console.log("[generateSubtractionProblemWithBorrowing] Entry");
    let num1, num2;
    let attempts = 0;

    do {
        attempts++;
        num1 = Math.floor(Math.random() * 90) + 10; // 10-99
        num2 = Math.floor(Math.random() * 99) + 1;  // 1-99

        // Conditions to satisfy:
        // 1. Result is greater than 0: num1 > num2
        // 2. Borrowing is required from the ones place: num1's ones digit < num2's ones digit
    } while (num1 <= num2 || (num1 % 10) >= (num2 % 10)); // Keep generating until both conditions met

    console.log(`[generateSubtractionProblemWithBorrowing] Generated after ${attempts} attempts: num1=${num1}, num2=${num2}, result=${num1-num2}`);
    const problem = { num1, num2, operator: '-' };
    console.log("[generateSubtractionProblemWithBorrowing] Returning problem:", problem);
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

// Generates a multiplication problem: 2-digit number * 2-digit number.
// num1 (2-digit) is 10-99. num2 (2-digit) is 10-99.
function generateTwoDigitByTwoDigitMultiplicationProblem() {
    console.log("[generateTwoDigitByTwoDigitMultiplicationProblem] Entry");
    const num1 = Math.floor(Math.random() * 90) + 10; // 10-99
    console.log(`[generateTwoDigitByTwoDigitMultiplicationProblem] Generated num1: ${num1}`);
    const num2 = Math.floor(Math.random() * 90) + 10; // 10-99
    console.log(`[generateTwoDigitByTwoDigitMultiplicationProblem] Generated num2: ${num2}`);
    const problem = { num1, num2, operator: '×' };
    console.log("[generateTwoDigitByTwoDigitMultiplicationProblem] Returning problem:", problem);
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

// Specific constants for 9x9 layout (used in generate9x9Homework and generateMixedMultiplicationHomework)
const FONT_SIZE_9X9 = 12;
const NUM_COLS_9X9 = 9;
const NUM_ROWS_9X9 = 9;
const ANSWER_LINE_LENGTH_PT_9X9 = FONT_SIZE_9X9 * 2.0;


console.log("[maths.js] PDF Layout Constants Initialized:", {
    PROBLEMS_PER_PAGE,
    NUM_COLS,
    NUM_ROWS,
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
    OPERATOR_PADDING_LEFT,
    FONT_SIZE_9X9,
    NUM_COLS_9X9,
    NUM_ROWS_9X9,
    ANSWER_LINE_LENGTH_PT_9X9
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

    const numPagesInput = document.getElementById('numPagesAddSub');
    const numPages = parseInt(numPagesInput.value) || 1;
    console.log(`[generateHomework] Number of pages requested: ${numPages}`);

    // Get new input values for subtraction types
    const requestedNoBorrow = parseInt(document.getElementById('numSubNoBorrowPerPage').value) || 0;
    const requestedWithBorrow = parseInt(document.getElementById('numSubWithBorrowPerPage').value) || 0;
    
    // Determine the actual number of each problem type per page
    let actualNoBorrowPerPage = Math.max(0, requestedNoBorrow);
    let actualWithBorrowPerPage = Math.max(0, requestedWithBorrow);

    const totalSubProblemsRequested = actualNoBorrowPerPage + actualWithBorrowPerPage;
    
    // If total requested subtraction problems exceed available slots, cap them.
    if (totalSubProblemsRequested > PROBLEMS_PER_PAGE) {
        if (actualNoBorrowPerPage > 0 && actualWithBorrowPerPage > 0) {
            // If both types are requested, distribute proportionally
            const ratioNoBorrow = actualNoBorrowPerPage / totalSubProblemsRequested;
            actualNoBorrowPerPage = Math.floor(PROBLEMS_PER_PAGE * ratioNoBorrow);
            actualWithBorrowPerPage = PROBLEMS_PER_PAGE - actualNoBorrowPerPage; // Fill remaining slots
        } else if (actualNoBorrowPerPage > 0) {
            actualNoBorrowPerPage = PROBLEMS_PER_PAGE; // Only no-borrow requested, take all slots
            actualWithBorrowPerPage = 0;
        } else if (actualWithBorrowPerPage > 0) {
            actualWithBorrowPerPage = PROBLEMS_PER_PAGE; // Only with-borrow requested, take all slots
            actualNoBorrowPerPage = 0;
        }
    }
    
    let actualAddPerPage = PROBLEMS_PER_PAGE - actualNoBorrowPerPage - actualWithBorrowPerPage;
    // Ensure actualAddPerPage is not negative due to unexpected edge cases, though it should be handled above.
    actualAddPerPage = Math.max(0, actualAddPerPage);

    console.log(`[generateHomework] Problems per page distribution: Add=${actualAddPerPage}, Sub No Borrow=${actualNoBorrowPerPage}, Sub With Borrow=${actualWithBorrowPerPage}`);

    doc.setFont('courier', 'normal'); // Monospaced font for good alignment
    console.log("[generateHomework] Font set to courier.");

    for (let p = 0; p < numPages; p++) {
        console.log(`[generateHomework] Starting page ${p + 1} of ${numPages}`);
        if (p > 0) {
            doc.addPage();
            console.log(`[generateHomework] Added new page ${p + 1}`);
        }
        
        doc.setFontSize(FONT_SIZE_PROBLEM); // Reset font size for problems

        // Prepare the list of problem types for this page
        let problemTypesForPage = [];
        for (let k = 0; k < actualAddPerPage; k++) problemTypesForPage.push('add');
        for (let k = 0; k < actualNoBorrowPerPage; k++) problemTypesForPage.push('sub_no_borrow');
        for (let k = 0; k < actualWithBorrowPerPage; k++) problemTypesForPage.push('sub_with_borrow');

        // Shuffle the array to randomize problem order on the page
        for (let i = problemTypesForPage.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [problemTypesForPage[i], problemTypesForPage[j]] = [problemTypesForPage[j], problemTypesForPage[i]];
        }
        console.log("[generateHomework] Shuffled problem types for page:", problemTypesForPage);

        for (let i = 0; i < PROBLEMS_PER_PAGE; i++) {
            console.log(`[generateHomework] Page ${p + 1}, Problem ${i + 1}`);
            let problem;
            const problemType = problemTypesForPage[i];

            switch (problemType) {
                case 'add':
                    problem = generateAdditionProblem();
                    break;
                case 'sub_no_borrow':
                    problem = generateSubtractionProblemNoBorrowing();
                    break;
                case 'sub_with_borrow':
                    problem = generateSubtractionProblemWithBorrowing();
                    break;
                default:
                    console.error("Unknown problem type:", problemType);
                    problem = generateAdditionProblem(); // Fallback to addition if type is unknown
            }
            console.log(`[generateHomework] Problem ${i + 1} (${problemType}): ${problem.num1} ${problem.operator} ${problem.num2}`);

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
            const lineYPos = yPos + FONT_SIZE_PROBLEM * 0.3; 
            
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
    // FONT_SIZE_9X9 and ANSWER_LINE_LENGTH_PT_9X9 are global now
    // NUM_COLS_9X9 and NUM_ROWS_9X9 are global now
    const CELL_WIDTH_9X9_CALC = CONTENT_WIDTH_LANDSCAPE_PT / NUM_COLS_9X9;
    const ALLOCATED_ROW_HEIGHT_9X9_CALC = CONTENT_HEIGHT_LANDSCAPE_PT / NUM_ROWS_9X9;

    console.log("[generate9x9Homework] Landscape Layout:", {
        EFFECTIVE_PAGE_WIDTH_PT, EFFECTIVE_PAGE_HEIGHT_PT,
        CONTENT_WIDTH_LANDSCAPE_PT, CONTENT_HEIGHT_LANDSCAPE_PT,
        FONT_SIZE_9X9, ANSWER_LINE_LENGTH_PT: ANSWER_LINE_LENGTH_PT_9X9,
        NUM_COLS_9X9, NUM_ROWS_9X9,
        CELL_WIDTH_9X9: CELL_WIDTH_9X9_CALC.toFixed(2), 
        ALLOCATED_ROW_HEIGHT_9X9: ALLOCATED_ROW_HEIGHT_9X9_CALC.toFixed(2)
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
            const totalProblemBlockWidth = problemTextWidth + ANSWER_LINE_LENGTH_PT_9X9;

            const colIndex = i % NUM_COLS_9X9;
            const rowIndex = Math.floor(i / NUM_COLS_9X9);

            // Calculate X position: Start of cell + centering adjustment for the "problem = ___" block
            const cellStartX = MARGIN_PT + (colIndex * CELL_WIDTH_9X9_CALC);
            const xPos = cellStartX + (CELL_WIDTH_9X9_CALC - totalProblemBlockWidth) / 2;

            // Calculate Y position for the text baseline (vertically centered in allocated row space)
            const rowTopEdgeY = MARGIN_PT + (rowIndex * ALLOCATED_ROW_HEIGHT_9X9_CALC);
            const yTextBaseline = rowTopEdgeY + (ALLOCATED_ROW_HEIGHT_9X9_CALC / 2) + (FONT_SIZE_9X9 / 3.5); // Fine-tune divisor for vertical centering
            
            doc.text(problemText, xPos, yTextBaseline);

            // Draw the line for the answer
            const lineStartX = xPos + problemTextWidth;
            const lineEndX = lineStartX + ANSWER_LINE_LENGTH_PT_9X9;
            const lineY = yTextBaseline + (FONT_SIZE_9X9 * 0.15); // Place line slightly below text baseline (adjust as needed)
            
            doc.setLineWidth(0.75);
            doc.line(lineStartX, lineY, lineEndX, lineY);
        }
        console.log(`[generate9x9Homework] Finished page ${p + 1}`);
    }

    doc.save('kids_9x9_multiplication_homework.pdf');
    console.log("[generate9x9Homework] PDF 'kids_9x9_multiplication_homework.pdf' saved. Exiting.");
}


function generateMixedMultiplicationHomework() {
    console.log("[generateMixedMultiplicationHomework] Entry");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'l', // Default to landscape for the first page of the PDF
        unit: 'pt',
        format: 'letter'
    });
    console.log("[generateMixedMultiplicationHomework] jsPDF instance created in LANDSCAPE mode.");

    const numSheetsInput = document.getElementById('numSheetsMixedMultiply');
    const numSheets = parseInt(numSheetsInput.value) || 1;
    console.log(`[generateMixedMultiplicationHomework] Number of sheets requested: ${numSheets}`);

    doc.setFont('courier', 'normal');
    console.log("[generateMixedMultiplicationHomework] Font set to courier.");

    // Landscape page dimensions (used for both page types in this function)
    // These are the dimensions of a 'letter' page in landscape.
    const LANDSCAPE_PAGE_WIDTH_PT = PAGE_HEIGHT_PT; // Original Portrait Height becomes Landscape Width
    const LANDSCAPE_PAGE_HEIGHT_PT = PAGE_WIDTH_PT;  // Original Portrait Width becomes Landscape Height
    
    const CONTENT_WIDTH_L_PT = LANDSCAPE_PAGE_WIDTH_PT - 2 * MARGIN_PT;
    const CONTENT_HEIGHT_L_PT = LANDSCAPE_PAGE_HEIGHT_PT - 2 * MARGIN_PT;

    for (let sheet = 0; sheet < numSheets; sheet++) {
        console.log(`[generateMixedMultiplicationHomework] Starting sheet ${sheet + 1} of ${numSheets}`);

        // --- Page 1: Vertical Multiplication (Landscape) ---
        if (sheet > 0) { 
            // Add a new landscape page if this is not the very first page of the PDF (sheet > 0)
            doc.addPage({ orientation: 'l', format: 'letter' });
            console.log(`[generateMixedMultiplicationHomework] Added new LANDSCAPE page for sheet ${sheet + 1}, page 1 (Vertical Mult)`);
        }
        // else, for sheet 0, page 1, use the initial landscape page created by new jsPDF().
        
        doc.setFontSize(FONT_SIZE_PROBLEM); // Font for vertical multiplication
        console.log(`[generateMixedMultiplicationHomework] Generating page 1 (Vertical Multiplication, Landscape) for sheet ${sheet + 1}`);

        // Layout for Vertical Multiplication on Landscape page
        const NUM_COLS_P1_L = 4; // 4 columns for vertical mult on landscape
        const NUM_ROWS_P1_L = 3;   // 3 rows for vertical mult on landscape
        const PROBLEMS_PER_PAGE_P1_L = NUM_COLS_P1_L * NUM_ROWS_P1_L; // 12 problems
        
        const CELL_WIDTH_P1_L = CONTENT_WIDTH_L_PT / NUM_COLS_P1_L;
        const CELL_HEIGHT_P1_L = CONTENT_HEIGHT_L_PT / NUM_ROWS_P1_L;

        for (let i = 0; i < PROBLEMS_PER_PAGE_P1_L; i++) {
            const problem = generateMultiplicationProblem();
            const row = Math.floor(i / NUM_COLS_P1_L);
            const col = i % NUM_COLS_P1_L;
            
            const cellX = MARGIN_PT + col * CELL_WIDTH_P1_L;
            const cellY = MARGIN_PT + row * CELL_HEIGHT_P1_L;

            const s_num1 = String(problem.num1); // This will be the 2-digit number
            const s_num2 = String(problem.num2); // This will be the 1-digit number
            // Using global PROBLEM_PADDING_RIGHT. This is a fixed value derived from portrait cell width.
            // It should be visually acceptable as landscape cell width (CELL_WIDTH_P1_L) is similar.
            const rightAlignX = cellX + CELL_WIDTH_P1_L - PROBLEM_PADDING_RIGHT;
            const twoDigitWidth = doc.getTextWidth("99"); // Using current font size (FONT_SIZE_PROBLEM)
            
            // Vertical centering for 3 lines (num1, op+num2, -----) within CELL_HEIGHT_P1_L.
            // LINE_SPACING is global, based on FONT_SIZE_PROBLEM.
            let yPos = cellY + (CELL_HEIGHT_P1_L - (3 * LINE_SPACING)) / 2 + LINE_SPACING;
            
            doc.text(s_num1, rightAlignX, yPos, { align: 'right' });
            yPos += LINE_SPACING;
            doc.text(s_num2, rightAlignX, yPos, { align: 'right' });
            // Using global OPERATOR_PADDING_LEFT, based on FONT_SIZE_PROBLEM.
            const operatorXPos = rightAlignX - twoDigitWidth - OPERATOR_PADDING_LEFT;
            doc.text(problem.operator, operatorXPos, yPos);
            
            const lineYPos = yPos + FONT_SIZE_PROBLEM * 0.3;
            doc.setLineWidth(0.75);
            const linePaddingLeftOfOperator = FONT_SIZE_PROBLEM * 0.2; 
            const lineStartX = operatorXPos - linePaddingLeftOfOperator;
            doc.line(lineStartX, lineYPos, rightAlignX, lineYPos);
        }
        console.log(`[generateMixedMultiplicationHomework] Finished page 1 (Vertical Multiplication, Landscape) for sheet ${sheet + 1}`);

        // --- Page 2: 9x9 Multiplication Table (Landscape) ---
        // This page will always be added, thus it's always a new page after page 1.
        doc.addPage({ orientation: 'l', format: 'letter' });
        console.log(`[generateMixedMultiplicationHomework] Added new LANDSCAPE page for sheet ${sheet + 1}, page 2 (9x9 Table)`);
        doc.setFontSize(FONT_SIZE_9X9); // Set font size for 9x9 table
        console.log(`[generateMixedMultiplicationHomework] Generating page 2 (9x9 Table, Landscape) for sheet ${sheet + 1}`);

        // Landscape page dimensions (CONTENT_WIDTH_L_PT, CONTENT_HEIGHT_L_PT) are already defined.
        // Global constants for 9x9 layout: NUM_COLS_9X9, NUM_ROWS_9X9, FONT_SIZE_9X9, ANSWER_LINE_LENGTH_PT_9X9.

        let all9x9ProblemsPage2 = []; // Use a distinct name for local variable
        for (let r = 1; r <= 9; r++) {
            for (let c = 1; c <= 9; c++) {
                all9x9ProblemsPage2.push({ num1: r, num2: c, operator: '×' });
            }
        }
        const PROBLEMS_TO_DISPLAY_9X9 = all9x9ProblemsPage2.length;

        const CELL_WIDTH_9X9_L = CONTENT_WIDTH_L_PT / NUM_COLS_9X9;
        const CELL_HEIGHT_9X9_L = CONTENT_HEIGHT_L_PT / NUM_ROWS_9X9;

        for (let i = 0; i < PROBLEMS_TO_DISPLAY_9X9; i++) {
            const problem = all9x9ProblemsPage2[i];
            const problemText = `${problem.num1}${problem.operator}${problem.num2} = `;
            const problemTextWidth = doc.getTextWidth(problemText); // Using current font size (FONT_SIZE_9X9)
            const totalProblemBlockWidth = problemTextWidth + ANSWER_LINE_LENGTH_PT_9X9;

            const colIndex = i % NUM_COLS_9X9;
            const rowIndex = Math.floor(i / NUM_COLS_9X9);

            const cellStartX_L = MARGIN_PT + (colIndex * CELL_WIDTH_9X9_L);
            const xPos_L = cellStartX_L + (CELL_WIDTH_9X9_L - totalProblemBlockWidth) / 2;
            
            const rowTopEdgeY_L = MARGIN_PT + (rowIndex * CELL_HEIGHT_9X9_L);
            const yTextBaseline_L = rowTopEdgeY_L + (CELL_HEIGHT_9X9_L / 2) + (FONT_SIZE_9X9 / 3.5);
            
            doc.text(problemText, xPos_L, yTextBaseline_L);

            const lineStartX_9x9 = xPos_L + problemTextWidth;
            const lineEndX_9x9 = lineStartX_9x9 + ANSWER_LINE_LENGTH_PT_9X9;
            const lineY_9x9 = yTextBaseline_L + (FONT_SIZE_9X9 * 0.15);
            
            doc.setLineWidth(0.75);
            doc.line(lineStartX_9x9, lineY_9x9, lineEndX_9x9, lineY_9x9);
        }
        console.log(`[generateMixedMultiplicationHomework] Finished page 2 (9x9 Table, Landscape) for sheet ${sheet + 1}`);
    }

    doc.save('kids_mixed_multiplication_homework.pdf');
    console.log("[generateMixedMultiplicationHomework] PDF 'kids_mixed_multiplication_homework.pdf' saved. Exiting.");
}


// New function for 2-digit by 2-digit multiplication with 9x9 table on back
function generateTwoDigitMultiplicationHomework() {
    console.log("[generateTwoDigitMultiplicationHomework] Entry");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'l', // Default to landscape for consistency in duplex printing
        unit: 'pt',
        format: 'letter'
    });
    console.log("[generateTwoDigitMultiplicationHomework] jsPDF instance created in LANDSCAPE mode.");

    const numSheetsInput = document.getElementById('numSheetsTwoDigitMultiply'); // New ID for input
    const numSheets = parseInt(numSheetsInput.value) || 1;
    console.log(`[generateTwoDigitMultiplicationHomework] Number of sheets requested: ${numSheets}`);

    doc.setFont('courier', 'normal');
    console.log("[generateTwoDigitMultiplicationHomework] Font set to courier.");

    // Landscape page dimensions (used for both page types in this function)
    const LANDSCAPE_PAGE_WIDTH_PT = PAGE_HEIGHT_PT; // Original Portrait Height becomes Landscape Width
    const LANDSCAPE_PAGE_HEIGHT_PT = PAGE_WIDTH_PT;  // Original Portrait Width becomes Landscape Height
    
    const CONTENT_WIDTH_L_PT = LANDSCAPE_PAGE_WIDTH_PT - 2 * MARGIN_PT;
    const CONTENT_HEIGHT_L_PT = LANDSCAPE_PAGE_HEIGHT_PT - 2 * MARGIN_PT;

    for (let sheet = 0; sheet < numSheets; sheet++) {
        console.log(`[generateTwoDigitMultiplicationHomework] Starting sheet ${sheet + 1} of ${numSheets}`);

        // --- Page 1: 2-Digit by 2-Digit Vertical Multiplication (Landscape) ---
        if (sheet > 0) { 
            doc.addPage({ orientation: 'l', format: 'letter' });
            console.log(`[generateTwoDigitMultiplicationHomework] Added new LANDSCAPE page for sheet ${sheet + 1}, page 1 (2x2 Vertical Mult)`);
        }
        
        doc.setFontSize(FONT_SIZE_PROBLEM); 
        console.log(`[generateTwoDigitMultiplicationHomework] Generating page 1 (2x2 Vertical Multiplication, Landscape) for sheet ${sheet + 1}`);

        // Layout for 2-Digit by 2-Digit Vertical Multiplication on Landscape page
        const NUM_COLS_P1_L_2x2 = 4; // Changed from 3 to 4 columns for 8 problems
        const NUM_ROWS_P1_L_2x2 = 2; // 2 rows for 8 problems
        const PROBLEMS_PER_PAGE_P1_L_2x2 = NUM_COLS_P1_L_2x2 * NUM_ROWS_P1_L_2x2; // 8 problems
        
        const CELL_WIDTH_P1_L_2x2 = CONTENT_WIDTH_L_PT / NUM_COLS_P1_L_2x2;
        const CELL_HEIGHT_P1_L_2x2 = CONTENT_HEIGHT_L_PT / NUM_ROWS_P1_L_2x2;

        for (let i = 0; i < PROBLEMS_PER_PAGE_P1_L_2x2; i++) {
            const problem = generateTwoDigitByTwoDigitMultiplicationProblem(); // Generate new type of problem
            const row = Math.floor(i / NUM_COLS_P1_L_2x2);
            const col = i % NUM_COLS_P1_L_2x2;
            
            const cellX = MARGIN_PT + col * CELL_WIDTH_P1_L_2x2;
            const cellY = MARGIN_PT + row * CELL_HEIGHT_P1_L_2x2;

            const s_num1 = String(problem.num1);
            const s_num2 = String(problem.num2);
            
            const rightAlignX = cellX + CELL_WIDTH_P1_L_2x2 - PROBLEM_PADDING_RIGHT;
            const twoDigitWidth = doc.getTextWidth("99"); 
            
            // Move problems to the upper part of the cell by adjusting the initial y-position
            // Original: let yPos = cellY + LINE_SPACING * 1.5; 
            let yPos = cellY + FONT_SIZE_PROBLEM * 0.75; // Adjusted to move problems higher
            
            doc.text(s_num1, rightAlignX, yPos, { align: 'right' });
            yPos += LINE_SPACING;
            doc.text(s_num2, rightAlignX, yPos, { align: 'right' });
            
            const operatorXPos = rightAlignX - twoDigitWidth - OPERATOR_PADDING_LEFT;
            doc.text(problem.operator, operatorXPos, yPos);
            
            const lineYPos = yPos + FONT_SIZE_PROBLEM * 0.3;
            doc.setLineWidth(0.75);
            const linePaddingLeftOfOperator = FONT_SIZE_PROBLEM * 0.2; 
            const lineStartX = operatorXPos - linePaddingLeftOfOperator;
            doc.line(lineStartX, lineYPos, rightAlignX, lineYPos);
        }
        console.log(`[generateTwoDigitMultiplicationHomework] Finished page 1 (2x2 Vertical Multiplication, Landscape) for sheet ${sheet + 1}`);

        // --- Page 2: 9x9 Multiplication Table (Landscape) ---
        doc.addPage({ orientation: 'l', format: 'letter' });
        console.log(`[generateTwoDigitMultiplicationHomework] Added new LANDSCAPE page for sheet ${sheet + 1}, page 2 (9x9 Table)`);
        doc.setFontSize(FONT_SIZE_9X9); 
        console.log(`[generateTwoDigitMultiplicationHomework] Generating page 2 (9x9 Table, Landscape) for sheet ${sheet + 1}`);

        let all9x9ProblemsPage2 = []; 
        for (let r = 1; r <= 9; r++) {
            for (let c = 1; c <= 9; c++) {
                all9x9ProblemsPage2.push({ num1: r, num2: c, operator: '×' });
            }
        }
        const PROBLEMS_TO_DISPLAY_9X9 = all9x9ProblemsPage2.length;

        const CELL_WIDTH_9X9_L = CONTENT_WIDTH_L_PT / NUM_COLS_9X9;
        const CELL_HEIGHT_9X9_L = CONTENT_HEIGHT_L_PT / NUM_ROWS_9X9;

        for (let i = 0; i < PROBLEMS_TO_DISPLAY_9X9; i++) {
            const problem = all9x9ProblemsPage2[i];
            const problemText = `${problem.num1}${problem.operator}${problem.num2} = `;
            const problemTextWidth = doc.getTextWidth(problemText); 
            const totalProblemBlockWidth = problemTextWidth + ANSWER_LINE_LENGTH_PT_9X9;

            const colIndex = i % NUM_COLS_9X9;
            const rowIndex = Math.floor(i / NUM_COLS_9X9);

            const cellStartX_L = MARGIN_PT + (colIndex * CELL_WIDTH_9X9_L);
            const xPos_L = cellStartX_L + (CELL_WIDTH_9X9_L - totalProblemBlockWidth) / 2;
            
            const rowTopEdgeY_L = MARGIN_PT + (rowIndex * CELL_HEIGHT_9X9_L);
            const yTextBaseline_L = rowTopEdgeY_L + (CELL_HEIGHT_9X9_L / 2) + (FONT_SIZE_9X9 / 3.5);
            
            doc.text(problemText, xPos_L, yTextBaseline_L);

            const lineStartX_9x9 = xPos_L + problemTextWidth;
            const lineEndX_9x9 = lineStartX_9x9 + ANSWER_LINE_LENGTH_PT_9X9;
            const lineY_9x9 = yTextBaseline_L + (FONT_SIZE_9X9 * 0.15);
            
            doc.setLineWidth(0.75);
            doc.line(lineStartX_9x9, lineY_9x9, lineEndX_9x9, lineY_9x9);
        }
        console.log(`[generateTwoDigitMultiplicationHomework] Finished page 2 (9x9 Table, Landscape) for sheet ${sheet + 1}`);
    }

    doc.save('kids_two_digit_multiplication_homework.pdf'); // New filename for this specific homework type
    console.log("[generateTwoDigitMultiplicationHomework] PDF 'kids_two_digit_multiplication_homework.pdf' saved. Exiting.");
}

console.log("[maths.js] Script fully loaded and functions defined.");