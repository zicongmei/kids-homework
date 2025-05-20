// jsPDF will be available globally from the script tag in HTML

// --- Problem Generation Logic ---

// Generates an addition problem where num1 + num2 < 100.
// Operands num1, num2 are at least 1.
// num1 is 1-98. num2 is 1 to (99-num1).
// This ensures num1 >= 1, num2 >= 1, and num1 + num2 <= 99 (i.e., < 100).
function generateAdditionProblem() {
    // num1 from 1 to 98. This ensures num1 >= 1.
    // If num1 were 99, num2 would have to be 0 to satisfy num1+num2 < 100,
    // but num2 must be >= 1. So, max num1 is 98 (e.g., 98 + 1 = 99).
    const num1 = Math.floor(Math.random() * 98) + 1; // 1-98

    // num2 from 1 up to (99 - num1).
    // (99 - num1) is the maximum value for num2 such that num1 + num2 <= 99.
    // The number of values in the range [1, K] is K.
    // So, num2 = Math.floor(Math.random() * (length_of_range)) + min_value.
    // Length of range [1, 99-num1] is (99-num1). Min value is 1.
    const num2 = Math.floor(Math.random() * (99 - num1)) + 1; // Ensures num2 >= 1 and num1 + num2 <= 99
    return { num1, num2, operator: '+' };
}

// Generates a subtraction problem num1 - num2 where num1 >= num2,
// no borrowing is needed, the result is > 10, and operands are >= 1.
// num1 is 12-99. num2 is 1 to num1 (no borrow).
function generateSubtractionProblem() {
    let num1, num2, num1_ones, num1_tens, num2_ones, num2_tens;

    do {
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

    // Loop until result is greater than 10 (i.e. num1 - num2 >= 11) AND num2 is at least 1.
    } while ((num1 - num2) <= 10 || num2 < 1); 

    return { num1, num2, operator: '-' };
}

// Randomly selects an addition or subtraction problem.
function generateProblem() {
    if (Math.random() < 0.5) {
        return generateAdditionProblem();
    } else {
        return generateSubtractionProblem();
    }
}

// --- PDF Generation Logic ---

const PROBLEMS_PER_PAGE = 12;
const NUM_COLS = 3;
const NUM_ROWS = 4;

// Letter paper dimensions in points (1 inch = 72 points)
const PAGE_WIDTH_PT = 8.5 * 72; // 612
const PAGE_HEIGHT_PT = 11 * 72; // 792
const MARGIN_PT = 0.75 * 72;    // 0.75 inch margin (54 points)

const CONTENT_WIDTH_PT = PAGE_WIDTH_PT - 2 * MARGIN_PT;
const CONTENT_HEIGHT_PT = PAGE_HEIGHT_PT - 2 * MARGIN_PT;

const CELL_WIDTH_PT = CONTENT_WIDTH_PT / NUM_COLS;
const CELL_HEIGHT_PT = CONTENT_HEIGHT_PT / NUM_ROWS;

const FONT_SIZE_PROBLEM = 40; // Font size for numbers and operator (increased from 30)
const LINE_SPACING_FACTOR = 1.3; // Factor to determine line height from font size
const LINE_SPACING = FONT_SIZE_PROBLEM * LINE_SPACING_FACTOR;

// const PROBLEM_NUMBER_FONT_SIZE = 10; // No longer needed
const PROBLEM_PADDING_RIGHT = CELL_WIDTH_PT * 0.2; // Right padding within cell for problem alignment
const OPERATOR_PADDING_LEFT = FONT_SIZE_PROBLEM * 0.5; // Padding left of operator

function generateHomework() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p', // portrait
        unit: 'pt',
        format: 'letter'
    });

    const numPagesInput = document.getElementById('numPages');
    const numPages = parseInt(numPagesInput.value) || 1;

    doc.setFont('courier', 'normal'); // Monospaced font for good alignment

    for (let p = 0; p < numPages; p++) {
        if (p > 0) {
            doc.addPage();
        }

        // Optional: Add page number header
        // doc.setFontSize(10);
        // Removed " - Math Homework" from title
        // doc.text(`Page ${p + 1} of ${numPages}`, PAGE_WIDTH_PT / 2, MARGIN_PT / 2, { align: 'center' });
        
        doc.setFontSize(FONT_SIZE_PROBLEM); // Reset font size for problems

        for (let i = 0; i < PROBLEMS_PER_PAGE; i++) {
            const problem = generateProblem();

            const row = Math.floor(i / NUM_COLS);
            const col = i % NUM_COLS;

            // Top-left corner of the current cell
            const cellX = MARGIN_PT + col * CELL_WIDTH_PT;
            const cellY = MARGIN_PT + row * CELL_HEIGHT_PT;

            // --- Problem number removed ---
            // doc.setFontSize(PROBLEM_NUMBER_FONT_SIZE);
            // doc.text(`${i + 1})`, cellX + PROBLEM_NUMBER_FONT_SIZE, cellY + PROBLEM_NUMBER_FONT_SIZE * 1.5);
            // doc.setFontSize(FONT_SIZE_PROBLEM); // Font size is already FONT_SIZE_PROBLEM


            // --- Draw problem in vertical format ---
            const s_num1 = String(problem.num1);
            const s_num2 = String(problem.num2);

            // X-coordinate for the right edge of the numbers (for right-alignment)
            const rightAlignX = cellX + CELL_WIDTH_PT - PROBLEM_PADDING_RIGHT;

            // Max width of a two-digit number string (e.g., "99") for consistent spacing
            const twoDigitWidth = doc.getTextWidth("99"); // Using "99" as a reference for max width

            // Y-coordinate for the baseline of the first number (num1)
            // Positioned to roughly center the problem block vertically in the cell.
            // A block of 3 lines (num1, num2, space for answer) is approx 3*LINE_SPACING high.
            let yPos = cellY + (CELL_HEIGHT_PT - (3 * LINE_SPACING)) / 2 + LINE_SPACING;

            // Draw num1
            doc.text(s_num1, rightAlignX, yPos, { align: 'right' });

            // Move to next line for num2 and operator
            yPos += LINE_SPACING;

            // Draw num2
            doc.text(s_num2, rightAlignX, yPos, { align: 'right' });

            // Draw operator, aligned to the left of where a two-digit number would start
            const operatorXPos = rightAlignX - twoDigitWidth - OPERATOR_PADDING_LEFT;
            doc.text(problem.operator, operatorXPos, yPos); // Default alignment is 'left'

            // Y-coordinate for the horizontal line below num2
            // Positioned slightly below the baseline of num2 text
            const lineYPos = yPos + FONT_SIZE_PROBLEM * 0.3; // Small gap after text descenders
            
            doc.setLineWidth(0.75); // Line thickness
            
            // The line should span from slightly left of the operator to the right edge of the numbers.
            // operatorXPos is the starting X coordinate of the operator text.
            const linePaddingLeftOfOperator = FONT_SIZE_PROBLEM * 0.2; // Extend line to the left of operator
            const lineStartX = operatorXPos - linePaddingLeftOfOperator;
            doc.line(lineStartX, lineYPos, rightAlignX, lineYPos);
        }
    }

    doc.save('kids_homework.pdf');
}