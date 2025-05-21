import joblib
import pandas as pd
import numpy as np
from urlAnalysis.pars import get_url_features  # Özellik çıkarımı burada olacak

class URLAnalyzer:
    def __init__(self, binary_model_path, multi_model_path):
        self.binary_model = joblib.load(binary_model_path)
        self.multi_model = joblib.load(multi_model_path)

        # Buraya eğitimde kullandığın feature isimlerini yaz
        self.feature_columns = [
            'feature1', 'feature2', 'feature3', 
            'feature4', 'feature5', 'feature6',
            # vs...
        ]

    def analyze_url(self, url):
        # Özellik çıkarımı
        features = get_url_features(url, mode=0)  # Mode 0 = predict için

        # Özellikleri doğru kolon isimleriyle DataFrame yap
        features_df = pd.DataFrame([features], columns=self.feature_columns)

        # (Eğer böyle bir kolon varsa) Çıkar
        if 'URL_Type_obf_Type' in features_df.columns:
            features_df = features_df.drop(columns=['URL_Type_obf_Type'])

        # Sadece sayısal verileri kullan
        features_df = features_df.select_dtypes(include=[np.number])

        # Birinci aşama: Zararlı mı?
        is_malicious = self.binary_model.predict(features_df)[0]

        if is_malicious == 0:
            label = "Benign"
        else:
            # İkinci aşama: Zararlı ise türü ne?
            malware_type = self.multi_model.predict(features_df)[0]
            label = f"Malicious ({malware_type})"

        # Dönüş
        return {
            "url": url,
            "prediction": label
        }
