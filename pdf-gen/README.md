# Kids Math Homework PDF Generator

## Description

This Python script generates PDF worksheets with basic addition and subtraction math problems suitable for young children. The problems are formatted vertically, similar to how they might appear in a textbook or workbook.

## Features

*   **Addition Problems:**
    *   Generates two-digit addition problems where at least one number is two digits.
    *   The sum of the two numbers is always less than 100.
    *   Avoids problems where both numbers are single-digit (e.g., 3 + 5) to focus on problems involving at least one two-digit number (e.g., 15 + 3 or 23 + 45).
*   **Subtraction Problems:**
    *   Generates two-digit subtraction problems where at least one number is two digits.
    *   Ensures the first number (`num1`) is greater than or equal to the second number (`num2`).
    *   Designed for "no borrowing": each digit in the first number is greater than or equal to the corresponding digit in the second number.
    *   Avoids problems where both numbers are single-digit.
*   **Formatting:**
    *   Problems are displayed in a clear, vertical format with a line for the answer.
    *   Questions are arranged in a 3-column layout on each page.
    *   Uses a monospaced bold font (`Courier-Bold`) for readability and proper alignment of numbers.
*   **Customization:**
    *   Specify the number of questions per page (default is 12).
    *   Specify the number of "sheets" to generate (each sheet consists of 2 pages of homework).
    *   Problems are an equal mix of addition and subtraction (or as close as possible if an odd number of questions), and are shuffled randomly on each page.

## Requirements

*   Python 3.x
*   ReportLab library

## Installation

To install the ReportLab library, use pip:
```bash
pip install reportlab
```

## Usage

1.  **Ensure Python and ReportLab are installed.**
2.  **Save the script** as `pdf-gen.py` (or your preferred filename).
3.  **Run the script from your terminal:**
    ```bash
    python pdf-gen.py
    ```

By default, this command will generate a PDF file named `math_homework_add_subtract.pdf` in the same directory as the script. This default PDF will contain 1 sheet (i.e., 2 pages), with 12 questions per page.

### Customizing the Output

You can easily customize the generated PDF by modifying the parameters in the `if __name__ == "__main__":` block at the end of the `pdf-gen.py` script.

**Parameters to modify:**
*   `pdf_file_name`: The name of the output PDF file.
*   `num_questions`: The total number of questions per page.
*   `sheet`: The number of sheets to generate. Each sheet contains 2 pages.

**Example Modification:**

To generate a PDF named `my_custom_homework.pdf` with 2 sheets (resulting in 4 pages total), and 15 questions on each page, modify the `if __name__ == "__main__":` block as follows:

```python
if __name__ == "__main__":
    # Default generation (commented out or removed):
    # create_math_homework_pdf("math_homework_add_subtract.pdf", num_questions=12, sheet=1)

    # Custom generation:
    pdf_file_name = "my_custom_homework.pdf"
    questions_per_page = 15
    number_of_sheets = 2  # This will produce 2 * 2 = 4 pages
    create_math_homework_pdf(pdf_file_name, num_questions=questions_per_page, sheet=number_of_sheets)
```

After saving your changes, run the script again:
```bash
python pdf-gen.py
```
This will create `my_custom_homework.pdf` with your specified settings.

## Generated PDF Structure

*   Each "sheet" argument generates two physical pages in the PDF.
*   Problems are arranged in three columns.
*   The font size for problems is set to 30pt `Courier-Bold` for clarity.

**Example of a single problem layout as it appears in the PDF:**

```
   34
+  12
------
```
(A similar layout is used for subtraction problems, e.g., `- 12`)

## Future Enhancements (Ideas)

*   Generate an accompanying answer key PDF.
*   Introduce options for multiplication and division problems.
*   Allow subtraction problems that require borrowing.
*   Provide more configuration options for page layout (margins, columns, fonts, font sizes) via command-line arguments or a configuration file.
*   Develop a simple Graphical User Interface (GUI) for easier generation without code modification.