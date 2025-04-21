from flask import Flask, request, jsonify
from flask_cors import CORS
from urlAnalysis.analysis import URLAnalyzer  # Mevcut sınıfın

app = Flask(__name__)
CORS(app)  # Tüm kaynaklardan gelen isteklere izin verir

analyzer = URLAnalyzer("first-stage-pkl/random_forest_binary.pkl", "second-stage-pkl/multiclass_dqn_model")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    url = data.get("url", "")
    result = analyzer.analyze_url(url)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000)
