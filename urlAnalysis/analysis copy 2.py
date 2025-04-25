import pandas as pd
import joblib
from stable_baselines3 import DQN
from urlAnalysis.pars import get_url_features
import numpy as np

class URLAnalyzer:
    def __init__(self, rf_score_model_path, dqn_model_path):
        self.rf_score_model = joblib.load(rf_score_model_path)
        self.dqn_model = DQN.load(dqn_model_path)
        self.malware_types = {
            0: "Defacement",
            1: "malware",
            2: "phishing",
            3: "spam"
        }

    def analyze_url(self, url):
        try:
            features = get_url_features(url, 0)
            features_df = pd.DataFrame([features])
            features_df = features_df.drop(columns=['URL_Type_obf_Type']).select_dtypes(include=[np.number])

            score_pred = self.rf_score_model.predict(features_df)[0]
            is_malicious = score_pred > 0.5

            result = {
                "url": url,
                "is_malicious": bool(is_malicious),
                "malicious_score": float(score_pred)
            }

            if is_malicious:
                dqn_action, _ = self.dqn_model.predict(features_df.values.astype(np.float32))
                result["malware_type"] = self.malware_types[int(dqn_action)]

            return result

        except Exception as e:
            return {
                "error": f"URL analiz edilirken hata oluştu: {str(e)}",
                "url": url,
                "is_malicious": None
            }


if __name__ == "__main__":
    rf_model_path = "first-stage-pkl/zararlilik_regresyon_modeli.pkl"
    dqn_model_path = "second-stage-pkl/dqn_model.zip"
    
    analyzer = URLAnalyzer(rf_model_path, dqn_model_path)
    
    while True:
        url = input("\nAnaliz edilecek URL'yi girin (Çıkış için Enter'a basın): ").strip()
        
        if not url:
            print("Çıkış yapılıyor...")
            break
        
        result = analyzer.analyze_url(url)
        
        print(f"\nURL: {result['url']}")
        if "error" in result:
            print(f"Hata: {result['error']}")
        else:
            print(f"Zararlı mı?: {result['is_malicious']}")
            print(f"Zararlılık skoru: {result['malicious_score']:.2f}")
            if result['is_malicious']:
                print(f"Zararlı Yazılım Türü: {result['malware_type']}")
