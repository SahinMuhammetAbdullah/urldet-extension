import pandas as pd
import joblib
from stable_baselines3 import DQN
from urlAnalysis.pars import get_url_features
import numpy as np

class URLAnalyzer:
    def __init__(self, rf_model_path, dqn_model_path):
        """
        URL analiz sistemini başlatır ve modelleri yükler
        
        Args:
            rf_model_path: Random Forest model dosya yolu
            dqn_model_path: DQN model dosya yolu
        """
        self.rf_model = joblib.load(rf_model_path)
        self.dqn_model = DQN.load(dqn_model_path)
        
    def analyze_url(self, url):
        """
        Kullanıcıdan aldığı URL'yi analiz eder ve sonucu döndürür
        
        Args:
            url: Analiz edilecek URL
            
        Returns:
            dict: Analiz sonuçları
        """
        try:
            # URL'den özellikleri çıkar
            features = get_url_features(url, 0)  # index 0 olarak veriyoruz
            
            # DataFrame oluştur ve gereksiz sütunu kaldır
            features_df = pd.DataFrame([features])
            features_df = features_df.drop(columns=['URL_Type_obf_Type']).select_dtypes(include=[np.number])
            
            # Random Forest ile zararlı olup olmadığını kontrol et
            rf_prediction_proba = self.rf_model.predict_proba(features_df)[0]
            is_malicious = rf_prediction_proba[1] > 0.5
            
            result = {
                "url": url,
                "is_malicious": bool(is_malicious),
                "benign_probability": float(rf_prediction_proba[0]),
                "malicious_probability": float(rf_prediction_proba[1])
            }
            
            # Eğer zararlıysa, DQN ile türünü belirle
            if is_malicious:
                features_array = features_df.values.astype('float32')
                dqn_action, _ = self.dqn_model.predict(features_array)
                
                # Zararlı türlerini eşle
                malware_types = {
                    0: "Defacement",
                    1: "malware",
                    2: "phishing",
                    3: "spam"
                }
                
                result["malware_type"] = malware_types[int(dqn_action)]
                
            return result
            
        except Exception as e:
            return {
                "error": f"URL analiz edilirken hata oluştu: {str(e)}",
                "url": url,
                "is_malicious": None
            }

if __name__ == "__main__":
    # Model dosya yolları
    rf_model_path = "first-stage-pkl/random_forest_binary.pkl"
    dqn_model_path = "second-stage-pkl/multiclass_dqn_model"
    
    # Analiz sınıfını başlat
    analyzer = URLAnalyzer(rf_model_path, dqn_model_path)
    
    while True:
        url = input("\nAnaliz edilecek URL'yi girin (Çıkış için Enter'a basın): ").strip()
        
        if not url:  # Boş giriş yapıldıysa çık
            print("Çıkış yapılıyor...")
            break
        
        result = analyzer.analyze_url(url)
        
        print(f"\nURL: {result['url']}")
        if "error" in result:
            print(f"Hata: {result['error']}")
        else:
            print(f"Zararlı mı?: {result['is_malicious']}")
            print(f"Zararsız olma olasılığı: {result['benign_probability']:.2%}")
            print(f"Zararlı olma olasılığı: {result['malicious_probability']:.2%}")
            if result['is_malicious']:
                print(f"Zararlı Yazılım Türü: {result['malware_type']}")
