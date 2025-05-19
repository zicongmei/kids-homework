# Kids Math Homework PDF Generator

This project provides a Python script and a Flask web service to generate PDF worksheets with basic addition and subtraction math problems suitable for young children. The problems are formatted vertically.

## Table of Contents

1.  [Features](#features)
2.  [Project Structure](#project-structure)
3.  [Requirements](#requirements)
4.  [Setup](#setup)
5.  [Usage](#usage)
    *   [Local Script Execution](#local-script-execution)
    *   [Web Service](#web-service)
        *   [Running with Docker](#running-with-docker)
        *   [Accessing the Service](#accessing-the-service)
        *   [Kubernetes Deployment](#kubernetes-deployment)
6.  [Makefile Commands](#makefile-commands)
7.  [Future Enhancements](#future-enhancements-ideas)

## Features

*   **Addition Problems:**
    *   Generates two-digit addition problems where at least one number is two digits.
    *   The sum of the two numbers is always less than 100.
*   **Subtraction Problems:**
    *   Generates two-digit subtraction problems where at least one number is two digits.
    *   Ensures the first number (`num1`) is greater than or equal to the second number (`num2`).
    *   Designed for "no borrowing": each digit in the first number is greater than or equal to the corresponding digit in the second number.
*   **Formatting:**
    *   Problems are displayed in a clear, vertical format with a line for the answer.
    *   Questions are arranged in a 3-column layout on each page.
    *   Uses a monospaced bold font (`Courier-Bold`) for readability.
*   **Customization (via script or web service parameters):**
    *   Specify the number of questions per page (default: 12, min: 1, max: 100).
    *   Specify the number of "sheets" to generate (each sheet consists of 2 pages of homework; default: 1, min: 1, max: 10).
    *   Problems are an equal mix of addition and subtraction, shuffled randomly on each page.
*   **Web Service:**
    *   Flask application serving PDF generation through a single `/` endpoint.
    *   Containerized with Docker using Gunicorn as the WSGI server.
    *   Makefile for easy build, run, and deployment tasks.
    *   Example Kubernetes deployment configuration.

## Project Structure

```
.
├── Dockerfile            # Docker configuration for building the service image
├── Makefile              # Makefile for common tasks (build, run, push, etc.)
├── math_question.py      # Core logic for generating math problems and PDF structure
├── server.py             # Flask web server application
├── requirements.txt      # Python dependencies (Flask, reportlab, gunicorn)
├── k8s-deploy.yaml       # Example Kubernetes deployment and service manifest
└── README.md             # This file
```

## Requirements

*   Python 3.x
*   ReportLab
*   Flask
*   Gunicorn (for running the web service in Docker)
*   Docker (for containerization and running the web service)
*   `kubectl` (optional, for Kubernetes deployment)

## Setup

1.  **Clone the repository (if applicable) or ensure all files are in a single directory.**
2.  **Install Python 3.x** if not already installed.
3.  **Create `requirements.txt`**:
    You can create this file manually or use the Makefile:
    ```bash
    make requirements.txt
    ```
    It should contain:
    ```
    Flask>=2.0
    reportlab>=3.6
    gunicorn>=20.0
    ```
4.  **Install Python dependencies** (optional if only using Docker, but useful for local script execution):
    ```bash
    pip install -r requirements.txt
    ```
5.  **Install Docker** if you plan to use the web service via Docker.

## Usage

### Local Script Execution

You can generate PDFs directly by running the `math_question.py` script.

1.  **Ensure Python and ReportLab are installed** (see Setup).
2.  **Run the script from your terminal:**
    ```bash
    python math_question.py
    ```
    This will generate a PDF file named `math_homework_add_subtract.pdf` in the current directory with 1 sheet (2 pages) and 12 questions per page.

    You can also use the Makefile target:
    ```bash
    make generate-local-pdf
    ```

3.  **Customizing Local Script Output:**
    Modify the `if __name__ == "__main__":` block at the end of `math_question.py`:
    ```python
    if __name__ == "__main__":
        # pdf_file_name = "my_custom_homework.pdf"
        # questions_per_page = 15
        # number_of_sheets = 2  # This will produce 2 * 2 = 4 pages
        # create_math_homework_pdf(pdf_file_name, num_questions=questions_per_page, sheet=number_of_sheets)

        # Default generation:
        create_math_homework_pdf("math_homework_add_subtract.pdf", num_questions=12, sheet=1)
    ```

### Web Service

The Flask application (`server.py`) provides an HTTP endpoint to generate PDFs.

#### Running with Docker

The easiest way to run the web service is using Docker. The `Makefile` simplifies this.

1.  **Build the Docker image:**
    ```bash
    make build
    ```
    This builds an image named `zicongmei/math-homework-pdf-gen:latest` (or as configured in the Makefile).

2.  **Run the Docker container:**
    ```bash
    make run
    ```
    This starts the container and maps port 8080 on your host to port 8080 in the container. The service will be accessible at `http://localhost:8080`.

#### Accessing the Service

The service exposes a single endpoint: `/`

*   **Endpoint:** `/`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `num_questions` (optional): Number of questions per page. Default: `12`. Range: `1-100`.
    *   `sheet` (optional): Number of sheets (2 pages per sheet). Default: `1`. Range: `1-10`.

**Examples:**

*   **Default PDF (12 questions/page, 1 sheet):**
    Open in your browser: `http://localhost:8080/`
    Or using `curl`:
    ```bash
    curl -o homework_default.pdf "http://localhost:8080/"
    ```

*   **Custom PDF (e.g., 20 questions/page, 2 sheets):**
    Open in your browser: `http://localhost:8080/?num_questions=20&sheet=2`
    Or using `curl`:
    ```bash
    curl -o homework_custom.pdf "http://localhost:8080/?num_questions=20&sheet=2"
    ```

If you provide invalid parameters (e.g., non-integer values, or values out of range), the service will return an error message with a `400 Bad Request` status.

#### Kubernetes Deployment

An example Kubernetes deployment (`k8s-deploy.yaml`) is provided.

1.  **Ensure your Docker image is pushed to a registry accessible by your Kubernetes cluster.**
    If using the default `zicongmei/math-homework-pdf-gen`, you might need to push it:
    ```bash
    make push  # Ensure IMAGE_REPO in Makefile is set to your Docker Hub username or other registry
    ```
    Update the `image` field in `k8s-deploy.yaml` if necessary.

2.  **Apply the Kubernetes manifests:**
    ```bash
    make k8s-apply
    # or
    # kubectl apply -f k8s-deploy.yaml
    ```
    This creates a Deployment and a LoadBalancer Service. The LoadBalancer might take a few minutes to get an external IP.

3.  **Delete the Kubernetes deployment:**
    ```bash
    make k8s-delete
    # or
    # kubectl delete -f k8s-deploy.yaml
    ```

## Makefile Commands

*   `make all` or `make build`: Builds the Docker image.
*   `make requirements.txt`: Generates the `requirements.txt` file.
*   `make push`: Pushes the Docker image to the configured repository (defined by `IMAGE_REPO`).
*   `make run`: Runs the Docker container locally, mapping port 8080.
*   `make generate-local-pdf`: Runs `math_question.py` to generate a PDF locally.
*   `make server-logs`: Fetches logs from the running Docker container (named `math-pdf-gen-container` by `make run`).
*   `make k8s-apply`: Applies the Kubernetes deployment.
*   `make k8s-delete`: Deletes the Kubernetes deployment.
*   `make clean`: Removes generated `requirements.txt` and `math_homework_add_subtract.pdf`.

## Generated PDF Structure

*   Each "sheet" argument generates two physical pages in the PDF.
*   Problems are arranged in three columns.
*   The font size for problems is set to 30pt `Courier-Bold`.

**Example of a single problem layout:**
```
   34
+  12
------
```

## Future Enhancements (Ideas)

*   Generate an accompanying answer key PDF.
*   Introduce options for multiplication and division problems.
*   Allow subtraction problems that require borrowing.
*   Provide more configuration options (margins, columns, fonts, font sizes) via endpoint parameters or a configuration file.
*   Develop a simple web UI (HTML form) to interact with the service instead of constructing URLs manually.
*   Add a dedicated `/health` endpoint for Kubernetes probes.