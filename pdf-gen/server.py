from flask import Flask, request, send_file
from math_question import create_math_homework_pdf
import io
import os

app = Flask(__name__)

@app.route('/')
def health_check():
    return "Math PDF Generator is running. Use /generate-pdf endpoint.", 200

@app.route('/generate-pdf', methods=['GET'])
def generate_pdf_route():
    try:
        num_questions_str = request.args.get('num_questions', '12')
        sheet_str = request.args.get('sheet', '1')

        if not num_questions_str.isdigit() or not sheet_str.isdigit():
            return "num_questions and sheet must be integers.", 400

        num_questions = int(num_questions_str)
        sheet = int(sheet_str)

        if not (0 < num_questions <= 100): # Max 100 questions per page
            return "num_questions must be between 1 and 100.", 400
        if not (0 < sheet <= 10): # Max 10 sheets (20 pages)
            return "sheet must be between 1 and 10.", 400

        pdf_buffer = io.BytesIO()
        create_math_homework_pdf(pdf_buffer, num_questions=num_questions, sheet=sheet)
        pdf_buffer.seek(0)

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f'math_homework_s{sheet}_q{num_questions}.pdf',
            mimetype='application/pdf'
        )
    except ValueError: # Should be caught by isdigit checks, but as a fallback
        return "Invalid input for num_questions or sheet. They must be integers.", 400
    except Exception as e:
        app.logger.error(f"Error generating PDF: {e}")
        return f"An error occurred while generating the PDF: {str(e)}", 500

if __name__ == '__main__':
    # Port is often set by environment variable in production, e.g. PORT
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)