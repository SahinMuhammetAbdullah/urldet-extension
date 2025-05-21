from flask import Flask, request, jsonify
from flask_cors import CORS
from urlAnalysis.analysis import URLAnalyzer  # URLAnalyzer burada tanımlı

# Flask app
app = Flask(__name__)
CORS(app)

# URLAnalyzer'ı başlat ve modelleri yükle
analyzer = URLAnalyzer(
    rf_model_path="models/rf_binary99.pkl",
    dqn_model_path="models/multiclass_dqn_modelV4-92-new"
)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        url = data.get("url", "")

        if not url:
            return jsonify({"error": "No URL provided"}), 400

        result = analyzer.analyze_url(url)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
