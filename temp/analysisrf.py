import pandas as pd
import joblib
import numpy as np
from pars_state.pars import get_url_features

class URLAnalyzer:
    def __init__(self, binary_model_path, multiclass_model_path):
        """
        URL analiz sistemini başlatır ve modelleri yükler.

        Args:
            binary_model_path (str): Zararlı/zarsız sınıflandırma modeli yolu (RandomForestClassifier Binary)
            multiclass_model_path (str): Zararlı URL'lerin türünü belirleyen çok sınıflı model yolu (RandomForestClassifier MultiClass)
        """
        self.rf_binary_model = joblib.load(binary_model_path)
        self.rf_multiclass_model = joblib.load(multiclass_model_path)
        
    def analyze_url(self, url):
        try:
            # URL'den özellik çıkar
            features = get_url_features(url, 0)  # index 0 kullanılıyor çünkü tek bir URL analiz ediliyor

            # Özellikleri DataFrame'e çevir
            features_df = pd.DataFrame([features])

            # Gereksiz sütunu kaldır ve sadece sayısal değerleri tut
            features_df = features_df.drop(columns=['URL_Type_obf_Type'], errors='ignore')
            features_df = features_df.select_dtypes(include=[np.number])

            # ÖZEL: Eğer eksik sütunlar varsa bunları da tamamla
            expected_features = self.rf_binary_model.feature_names_in_
            for col in expected_features:
                if col not in features_df.columns:
                    features_df[col] = 0  # eksik kolon varsa 0 ile doldur

            # Sadece modelin beklediği sırayla kolonları al
            features_df = features_df[expected_features]

            # Zararlı mı değil mi tahmin et (Binary sınıflandırma)
            rf_prediction_proba = self.rf_binary_model.predict_proba(features_df)[0]
            is_malicious = rf_prediction_proba[1] > 0.5  # %50'den büyükse zararlı kabul ediliyor

            result = {
                "url": url,
                "is_malicious": bool(is_malicious),
                "benign_probability": float(rf_prediction_proba[0]),
                "malicious_probability": float(rf_prediction_proba[1])
            }

            # Eğer zararlıysa, zararlı türünü tespit et
            if is_malicious:
                # YİNE ARRAY'E ÇEVİRME, DataFrame ile devam et!
                multiclass_prediction = self.rf_multiclass_model.predict(features_df)[0]

                # Sınıf etiketlerini tanımla
                malware_types = {
                    0: "Defacement",
                    1: "Malware",
                    2: "Phishing",
                    3: "Spam"
                }

                result["malware_type"] = malware_types.get(int(multiclass_prediction), "Unknown")
            
            return result

        except Exception as e:
            return {
                "error": f"URL analiz edilirken hata oluştu: {str(e)}",
                "url": url,
                "is_malicious": None
            }
