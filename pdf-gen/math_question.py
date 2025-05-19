import random
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

def generate_addition_problem():
    """
    Generates an addition problem (num1, num2, operator)
    where num1 + num2 < 100.
    Avoids problems where both numbers are less than 10.
    """
    while True:
        num1 = random.randint(0, 99)
        num2 = random.randint(0, 99)
        # Conditions for a valid problem:
        # 1. The sum must be less than 100.
        # 2. It's not the case that both numbers are less than 10.
        if (num1 + num2 < 100) and not (num1 < 10 and num2 < 10):
            return num1, num2, "+"

def generate_subtraction_problem():
    """
    Generates a subtraction problem (num1, num2, operator)
    with no borrowing. num1 >= num2.
    Digits of num1 are greater than or equal to corresponding digits of num2.
    Avoids problems where both numbers are less than 10.
    """
    while True:
        ones_digit_num1 = random.randint(0, 9)
        ones_digit_num2 = random.randint(0, ones_digit_num1)
        
        tens_digit_num1 = random.randint(0, 9)
        tens_digit_num2 = random.randint(0, tens_digit_num1)
        
        num1 = tens_digit_num1 * 10 + ones_digit_num1
        num2 = tens_digit_num2 * 10 + ones_digit_num2
        
        # Avoid problems where both numbers are less than 10.
        # This condition also implicitly handles the '0 - 0' case,
        # which was previously a separate check (if num1 == 0 and num2 == 0: continue).
        if num1 < 10 and num2 < 10:
            continue
        
        return num1, num2, "-"

def draw_vertical_math_problem(cv, x_cell_start, y_cell_top, cell_width,
                               num1, num2, operator,
                               font_name="Courier-Bold", font_size=18,
                               problem_padding_top=0.3*inch,
                               problem_padding_left=0.25*inch):
    """
    Draws a single math problem in vertical format within a given cell.
    (x_cell_start, y_cell_top) is the bottom-left corner of the cell, with y_cell_top being the
    y-coordinate of the top boundary of the cell. ReportLab's y-coordinates are from bottom of page.
    """
    
    line_spacing_factor = 1.3  # Multiplier for font_size to get line height
    line_spacing_points = font_size * line_spacing_factor

    num1_str = f"{num1:>2}"  # Right align, width 2 (e.g., " 5" or "15")
    num2_str = f"{num2:>2}"
    
    cv.setFont(font_name, font_size)

    # Calculate widths of elements
    # Operator display string includes a space for separation: e.g., "+ "
    operator_display_str = operator + " "
    operator_text_width = cv.stringWidth(operator_display_str, font_name, font_size)
    # Max width for numbers (e.g., "99")
    max_number_text_width = cv.stringWidth("99", font_name, font_size) 
    
    # X positions
    # content_x_start is where the operator part of the problem begins (e.g. "+ " or "- ")
    content_x_start = x_cell_start + problem_padding_left
    
    # The numbers (num1_str, num2_str) will be right-aligned.
    # Their right edge will be at: content_x_start + operator_text_width + max_number_text_width
    numbers_right_align_x = content_x_start + operator_text_width + max_number_text_width

    # Y positions (ReportLab y-coordinates are from the bottom of the page)
    # y_cell_top is the y-coordinate of the top edge of the cell.
    # We draw downwards from this top edge.
    
    # Baseline Y for the first number (num1)
    y_baseline_num1 = y_cell_top - problem_padding_top - font_size
    # Baseline Y for the second number (num2) and the operator
    y_baseline_num2_and_operator = y_baseline_num1 - line_spacing_points
    # Y position for the horizontal line under the numbers
    # A small gap below the baseline of num2 for descenders and spacing
    line_y_position = y_baseline_num2_and_operator - (font_size * 0.35) 

    # Draw num1 (top number)
    cv.drawRightString(numbers_right_align_x, y_baseline_num1, num1_str)
    # Draw operator (e.g., "+")
    cv.drawString(content_x_start, y_baseline_num2_and_operator, operator_display_str)
    # Draw num2 (bottom number)
    cv.drawRightString(numbers_right_align_x, y_baseline_num2_and_operator, num2_str)
    # Draw the horizontal line
    # Line starts horizontally aligned with the operator and ends at the numbers' right edge.
    cv.line(content_x_start, line_y_position, numbers_right_align_x, line_y_position)


def create_math_homework_pdf(file_path, num_questions=12, sheet=1):
    """
    Creates a PDF file with math homework questions.
    For each sheet, 2 pages of homework are generated.
    num_questions specifies the number of questions per page.
    `file_path` can be a string path or a file-like object (e.g., io.BytesIO).
    """
    my_canvas = canvas.Canvas(file_path, pagesize=letter)
    my_canvas.setAuthor("Math Homework Generator")

    # Layout parameters for questions (per page)
    num_cols = 3  # Number of columns for questions
    # Calculate number of rows needed per page based on questions and columns
    num_rows_per_page = (num_questions + num_cols - 1) // num_cols 

    # Define margins for the content area on each page
    margin_top_content = 0.75 * inch
    margin_bottom_content = 0.75 * inch
    margin_left_content = 0.75 * inch
    margin_right_content = 0.75 * inch

    # Calculate drawable area for the questions grid on each page
    drawable_width = letter[0] - margin_left_content - margin_right_content
    drawable_height = letter[1] - margin_top_content - margin_bottom_content

    cell_width = drawable_width / num_cols
    cell_height = drawable_height / num_rows_per_page
    
    problem_font_size_pt = 30 # Characters enlarged
    problem_font_name = "Courier-Bold" # Monospaced and bold for clear, aligned numbers

    for s_idx in range(sheet): # Loop for each sheet
        for p_idx in range(2): # Generate 2 pages per sheet
            # Generate questions for the current page
            questions_for_page = []
            num_addition = num_questions // 2
            num_subtraction = num_questions - num_addition

            for _ in range(num_addition):
                questions_for_page.append(generate_addition_problem())
            for _ in range(num_subtraction):
                questions_for_page.append(generate_subtraction_problem())
            
            random.shuffle(questions_for_page) # Mix addition and subtraction problems

            for i, (num1, num2, operator) in enumerate(questions_for_page):
                col_idx = i % num_cols
                row_idx = i // num_cols

                # Calculate the coordinates for the current cell on the current page
                x_cell_ref = margin_left_content + (col_idx * cell_width)
                y_cell_ref_top = (letter[1] - margin_top_content) - (row_idx * cell_height)

                draw_vertical_math_problem(
                    my_canvas, x_cell_ref, y_cell_ref_top, cell_width,
                    num1, num2, operator,
                    font_name=problem_font_name, font_size=problem_font_size_pt
                )
            
            # If this is not the very last page of the document, add a new page
            is_last_sheet = (s_idx == sheet - 1)
            is_last_page_in_sheet = (p_idx == 1)
            if not (is_last_sheet and is_last_page_in_sheet):
                my_canvas.showPage()

    my_canvas.save()
    if isinstance(file_path, str):
        print(f"PDF successfully created at: {file_path}")

if __name__ == "__main__":
    pdf_file_name = "math_homework_add_subtract.pdf"
    # Generate a PDF with 1 sheet (which means 2 pages), 12 questions per page.
    create_math_homework_pdf(pdf_file_name, num_questions=12, sheet=1)
    # Example for 2 sheets (4 pages total):
    # create_math_homework_pdf("math_homework_4_pages.pdf", num_questions=12, sheet=2)