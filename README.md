# Kids Math Homework Generator

This project is a simple web-based tool to generate math homework worksheets for kids. It creates printable PDF files with math problems suitable for early elementary students.

The website is deployed and accessible at: **https://zicongmei.github.io/kids-homework/**

## Features

The generator can create two types of math worksheets:

### 1. Addition & Subtraction
*   **Addition Problems:** Generates problems where the sum of two numbers is less than 100 (e.g., `23 + 45`). Both operands are at least 1.
*   **Subtraction Problems:** Generates problems that do not require borrowing (e.g., `78 - 23`). The result of the subtraction is always greater than 10, and both operands are positive.
*   **Mixed Worksheets:** Each page contains a mix of addition and subtraction problems.
*   **Balanced Difficulty:** To avoid overwhelming students with too many subtraction problems, a maximum of 4 subtraction problems are included per page (out of 12 total problems).
*   **Format:** Problems are presented in a vertical format, ready for solving.

### 2. Multiplication
*   **Problem Type:** Generates multiplication problems of a 2-digit number by a 1-digit number (e.g., `45 × 3`). The 1-digit number is between 2 and 9 (inclusive).
*   **Format:** Problems are presented in a vertical format.

### General Features
*   **Customizable Number of Pages:** Users can specify how many pages of homework they want to generate.
*   **PDF Output:** Worksheets are generated as PDF files, making them easy to print or share.
*   **Clear Layout:** Problems are arranged in a grid (3 columns, 4 rows) for clarity.

## How to Use

1.  Visit the website: [https://zicongmei.github.io/kids-homework/](https://zicongmei.github.io/kids-homework/)
2.  The page will automatically redirect to the math generator.
3.  Choose the type of homework you want to generate (Addition & Subtraction or Multiplication).
4.  Enter the desired number of pages in the input field for the chosen section.
5.  Click the "Generate ... PDF" button for that section.
6.  A PDF file will be automatically downloaded by your browser (e.g., `kids_add_sub_homework.pdf` or `kids_multiplication_homework.pdf`).

## Technical Details
*   The frontend is built with HTML, CSS, and JavaScript.
*   PDF generation is handled by the [jsPDF](https://github.com/parallax/jsPDF) library.
*   The site is hosted on GitHub Pages.

This tool aims to provide a quick and easy way for parents and teachers to create practice materials for young learners.