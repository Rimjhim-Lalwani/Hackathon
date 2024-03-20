import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle

app = Flask(__name__)

model = pickle.load(open('model_updated.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['GET'])  # Handle GET requests
def predict():
    # Extract data from URL parameters
    sales_first_month = int(request.args.get('sales_first_month', default=0))
    sales_second_month = int(request.args.get('sales_second_month', default=0))

    # Prepare the input features for prediction
    int_features = [[sales_first_month, sales_second_month]]
    prediction = model.predict(int_features)

    output = round(prediction[0], 2)
    return jsonify({'prediction_text': 'Product to be sold in future: {}'.format(output)})

if __name__ == "__main__":
    app.run(debug=True)
