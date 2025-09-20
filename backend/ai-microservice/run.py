from flask import Flask,request, jsonify
from structured_out import call_model
from chatbot import call_chatbot
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/parse-expense', methods = ['POST'])
def parse_expense_route():
    data = request.get_json()
    if not data or 'rawInput' not in data:
        return jsonify({'success': False, 'message': 'rawInput is required'}), 400

    raw_input = data.get("rawInput")

    try:
        result = call_model(query=raw_input)
        return jsonify({
            'success': True,
            'data': {
                "amount": result.amount,
                "category": result.category,
                "description": result.description,
                "merchant": result.merchant
            }
        })
    except Exception as e:
        # It's good practice to log the error
        app.logger.error(f"Error in /parse-expense: {e}")
        return jsonify({'success': False, 'message': 'Error processing request'}), 500

@app.route('/get-advice', methods = ['POST'])
def interact_chatbot():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'success': False, 'message': 'query is required'}), 400

    query = data.get("query")
    expenses = data.get("expenses")

    try:
        if expenses:
            formatted_expenses = ", ".join([
                f"{exp['category']}: {exp['amount']} ({exp['description']})" for exp in expenses])
            result = call_chatbot(query, formatted_expenses)
        else:
            result = call_chatbot(query)

        return jsonify({
            "success": True,
            "message": result.content
        })
    except Exception as e:
        app.logger.error(f"Error in /get-advice: {e}")
        # The traceback indicates the error is here. The most likely cause is writing to a file
        # without specifying UTF-8 encoding in `chatbot.py`.
        # To fix it, open the file like this:
        # with open('your_log_file.txt', 'a', encoding='utf-8') as file:
        #     file.write(...)
        return jsonify({'success': False, 'message': 'Error processing AI request'}), 500

    
if __name__ == '__main__':
    app.run(debug=True)