import pandas as pd
import urllib
from urllib.parse import urlparse, parse_qs, parse_qsl
import tldextract
import re
from collections import Counter
import math
import os
import csv


# URL'den özellikleri çıkaran fonksiyonlar
def cal(url):
    if not url.startswith(("http://", "https://")):
        url = f"http://{url}"

    # URL'yi ayrıştır
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    path = parsed_url.path
    query = parsed_url.query
    file_name = path.split("/")[-1] if path else ""
    file_extension = file_name.split(".")[-1] if file_name and "." in file_name else ""
    fragment = parsed_url.fragment

    # Path'ten Directory kısmını al (dosya adı hariç)
    directory = os.path.dirname(path)

    return domain, path, directory, query, file_name, file_extension, fragment


def get_domain_token_count(url):
    """
    Domain token count'u doğru hesaplamak için tldextract ve ek kontroller kullanılır.
    """
    domain = tldextract.extract(url)

    # Subdomain, domain ve suffix'i al
    subdomain_tokens = domain.subdomain.split(".") if domain.subdomain else []
    domain_tokens = [domain.domain] if domain.domain else []

    # Suffix'i kontrol et ve uygun şekilde işleyin
    suffix_tokens = domain.suffix.split(".") if domain.suffix else []

    # Eğer suffix'in birden fazla parçası varsa (örneğin 'com.tr'), bunu tek bir token olarak kabul et
    if len(suffix_tokens) > 1:
        suffix_tokens = [
            ".".join(suffix_tokens)
        ]  # 'com.tr' gibi bir suffix'i tek bir token yap

    # Tüm token'ları birleştir ve say
    all_tokens = subdomain_tokens + domain_tokens + suffix_tokens
    return len(all_tokens)


def get_path_token_count(path):

    # Path'i '/' ile bölerek token sayısını döndür
    tokens = path.strip("/").split("/") if path else []
    return len(tokens)


def get_avg_domain_token_len(url):
    """
    Bir URL'deki domain'in tokenlarının ortalama uzunluğunu hesaplar.
    www, subdomain ve asıl domain bileşenlerini doğru şekilde ayrıştırır.

    Parametre:
        url (str): Analiz edilecek URL.

    Dönüş:
        float: Tokenların ortalama uzunluğu.
    """
    # Domain'i URL'den ayrıştır
    extracted = tldextract.extract(url)

    # Subdomain, domain ve suffix bileşenlerini al
    subdomain = extracted.subdomain
    domain = extracted.domain
    suffix = extracted.suffix

    # Tokenları oluştur (subdomain varsa ekle)
    tokens = []
    if subdomain:
        tokens.extend(subdomain.split("."))
    if domain:
        tokens.append(domain)
    if suffix:
        tokens.append(suffix)

    # Her bir tokenın uzunluğunu hesapla ve ortalamayı döndür
    return sum(len(token) for token in tokens) / len(tokens) if tokens else 0


def get_long_domain_token_len(domain):
    """
    Bir URL'deki domain'in en uzun token uzunluğunu döndürür.
    com.tr, co.uk gibi suffix'leri doğru şekilde tek bir token olarak sayar.
    """
    # Domain'i tldextract ile ayrıştır
    extracted = tldextract.extract(domain)

    # Subdomain, domain ve suffix bileşenlerini al
    subdomain_tokens = extracted.subdomain.split(".") if extracted.subdomain else []
    domain_tokens = [extracted.domain] if extracted.domain else []
    suffix_tokens = [extracted.suffix] if extracted.suffix else []

    # Token listesi oluştur
    all_tokens = subdomain_tokens + domain_tokens + suffix_tokens

    # En uzun token'ı döndür
    return max([len(token) for token in all_tokens]) if all_tokens else 0


def get_avg_path_token_len(path):
    """
    Bir URL'nin path kısmındaki tokenların ortalama uzunluğunu hesaplar.
    """
    # Path'i '/' ile bölerek tokenlara ayır
    tokens = path.strip("/").split("/") if path else []

    # Token uzunluklarının ortalamasını döndür
    return sum(len(token) for token in tokens) / len(tokens) if tokens else 0




def get_tld_risk_for_url(url):
    # 1. tldextract ile TLD'yi çıkar
    extracted = tldextract.extract(url)
    suffix = extracted.suffix  # örneğin: 'gov.tr'

    if not suffix:
        return 50  # TLD yoksa varsayılan değer dön
    
    tld = '.' + suffix  # başına . ekleyerek .gov.tr formatına getir

    # 2. CSV dosyasını oku ve risk değerini bul
    try:
        with open("pars_state/tld_weights.csv", mode="r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["tld_name"].strip() == tld:
                    return float(row["weighted_risk_percentage"])
    except FileNotFoundError:
        print("tld_weights.csv dosyası bulunamadı.")

    # 3. Listede yoksa varsayılan risk değeri dön
    return 50




def get_char_comp_vowels(url):
    vowels = re.findall(r"[aeiouAEIOU]", url)
    return len(vowels)


def get_char_comp_ace(url):
    ace_chars = re.findall(r"[aceACE]", url)
    return len(ace_chars)


def calculate_ldl(s):
    """
    URL'deki harf-rakam-harf (ldl) desenlerinin sayısını hesaplar.
    """
    return len(re.findall(r"[A-Za-z][0-9][A-Za-z]", s))


def calculate_dld(s):
    """
    s'deki rakam-harf-rakam (dld) desenlerinin sayısını hesaplar.
    """
    return len(re.findall(r"[0-9][A-Za-z][0-9]", s))


def arg_len(query):
    args = parse_qs(query)
    arg_len = sum(len(k) + len(v[0]) for k, v in args.items())
    return arg_len


def calculate_raito(s, v):
    return s / v if v > 0 else 0


def is_executable(path):
    executable_extensions = {
        ".exe", ".com", ".bat", ".cmd", ".msi", ".dll", ".scr", ".sys", ".ps1",
        ".vbs", ".js", ".jse", ".wsf", ".wsh", ".pif", ".cpl", ".msc",
        ".sh", ".bin", ".run", ".out", ".bash", ".zsh", ".ksh", ".csh", ".so",
        ".py", ".pl", ".cgi", ".rb", ".php", ".asp", ".aspx", ".jsp",
        ".jar", ".war", ".class",
        ".apk", ".deb", ".rpm", ".dmg", ".pkg", ".app",
        ".tar.gz", ".zip", ".rar", ".7z"
    }

    path = path.lower()
    parts = path.split("/")[-1].split(".")

    # Eğer hiç uzantı yoksa
    if len(parts) < 2:
        return 0

    # Uzantı kombinasyonlarını sondan başlayarak birleştirerek kontrol et
    for i in range(1, len(parts)):
        ext = "." + ".".join(parts[-i:])
        if ext in executable_extensions:
            return 1

    return 0


def is_port_eighty(url):
    # URL'nin başında http veya https yoksa -1 döndür
    if not url.startswith(("http://", "https://")):
        return -1
    # https ile başlıyorsa 1 döndür
    elif url.startswith("https://"):
        return 1
    # http ile başlıyorsa 0 döndür
    elif url.startswith("http://"):
        return 0


def calculate_character_continuity_rate(url):
    # Harf dizileri (A-Z, a-z)
    longest_letter_seq = max([len(seq) for seq in re.findall(r"[A-Za-z]+", url)] or [0])

    # Rakam dizileri (0-9)
    longest_digit_seq = max([len(seq) for seq in re.findall(r"[0-9]+", url)] or [0])

    # Sembol dizileri (!, @, #, vs.)
    longest_symbol_seq = max([len(seq) for seq in re.findall(r"[^\w\s]+", url)] or [0])

    # URL'nin toplam uzunluğu
    url_length = len(url)

    # Oranı hesapla, URL uzunluğu sıfırsa oran sıfır olur
    if url_length == 0:
        return 0
    return (longest_letter_seq + longest_digit_seq + longest_symbol_seq) / url_length


def calculate_longest_variable_value_from_query(query):
    """
    Query string içindeki en uzun değerin uzunluğunu hesaplar.
    """
    if not query:
        return -1
    params = parse_qs(query)  # Sözlük formatında parametreleri ayıklar

    # En uzun değeri bul
    longest_value_length = max([len(value[0]) for value in params.values()] or [0])

    return longest_value_length


def calculate_digit_count(s):
    """
    Bir s'deki toplam rakam (digit) sayısını hesaplar.
    Eğer s boşsa -1 döner.
    """
    # Eğer 's' boşsa -1 döndür
    if not s:
        return -1

    # URL'deki tüm rakamları bul
    digits = re.findall(r"\d", s)

    # Toplam rakam sayısını döndür
    return len(digits)


def calculate_letter_count(s):
    """
    Bir s'deki toplam harf (letter) sayısını hesaplar.
    Eğer s boşsa -1 döner.
    """
    # Eğer 's' boşsa -1 döndür
    if not s:
        return -1

    # URL'deki tüm rakamları bul
    letter = re.findall(r"[a-zA-Z]", s)

    # Toplam rakam sayısını döndür
    return len(letter)


def arguments_longest_word_length(query):
    if not query:
        return -1  # If query is empty, return -1

    # Parse the query and flatten the list of key-value pairs
    arguments = [item for key, value in parse_qsl(query) for item in (key, value)]

    # If the arguments list is empty, return -1 instead of calling max()
    if not arguments:
        return 0

    return max(len(arg) for arg in arguments)


def count_sensitive_words(url):
    """
    Bir URL içinde geçen hassas kelimelerin sayısını döndürür.
    """
    sensitive_words = [
        "admin", "login", "signin", "signup", "auth", "password", "user",
        "account", "secure", "safety", "protection", "privacy", "encrypted",
        "firewall", "bank", "credit", "debit", "card", "money", "pay", "payment",
        "paypal", "checkout", "transaction", "billing", "hack", "phish", "malware",
        "attack", "exploit", "virus", "spyware", "rootkit", "order", "cart", "product",
        "offer", "deal", "coupon", "free", "gift", "verification", "confirm", "validate",
        "update", "access", "support", 
    ]
    # Hassas kelimeleri düzenli ifadeye dönüştür
    pattern = "|".join([re.escape(word) for word in sensitive_words])

    # URL'deki hassas kelimelerin tüm eşleşmelerini bul
    matches = re.findall(pattern, url, re.IGNORECASE)  # Büyük/küçük harf duyarsız

    # Eşleşen kelimelerin sayısını döndür
    return len(matches)


def url_queries_variable(query):
    # Sorgu kısmındaki parametreleri ayıkla
    query_params = parse_qs(query)

    # Anahtar ve değer sayısını hesaplayalım
    key_count = 0
    value_count = 0
    no_value_count = 0
    value_only_count = (
        0  # Sadece değer olup, anahtarı olmayan parametreleri saymak için
    )

    # Parametrelerin her birini kontrol edelim
    for key, values in query_params.items():
        if key:  # Anahtar varsa
            key_count += 1
            if values:  # Değer varsa
                value_count += len(
                    values
                )  # Birden fazla değer olabilir, bu yüzden liste uzunluğunu sayıyoruz
            else:  # Değer yoksa
                no_value_count += 1
        else:
            # Anahtarı olmayan parametre, yani sadece değer var
            value_only_count += len(values)  # Her bir değeri sayıyoruz

    total_count = key_count + value_count + no_value_count + value_only_count
    return total_count


def unique_special_char_count(url):
    # URL kodlamasını çöz
    decoded_url = urllib.parse.unquote(url)
    
    # Çözülmüş özel karakterleri topla
    decoded_special_chars = re.findall(r"[^\w]", decoded_url)
    
    # Benzersiz özel karakter sayısını hesapla
    unique_chars = set(decoded_special_chars)
    
    return len(unique_chars)


def calculate_delimeter_count(url):
    # delimiters = ['://', '/', '?', '&', '#']
    count = 0

    # Protokol ayırıcıları
    if "://" in url:
        count += 1

    # Domain ve Path ayırıcıları
    count += url.count("/")

    # Query ayırıcıları
    count += url.count("?")
    count += url.count("&")

    # Fragment ayırıcıları
    count += url.count("#")

    return count


def number_rate(s, v):
    """
    s'deki numaraların v'nin uzunluğuna oranını hesaplar.
    """
    if not (s or v):
        return -1

    return len(re.findall(r"\d", s)) / len(v) if len(v) > 0 else 0


def symbol_count(s):
    """
    s'deki sembollerin adetini hesaplar.
    """
    if not s:
        return -1

    return len(re.findall(r"[^\w\s]", s))


def calculate_entropy(s):
    # s olamyan bir değerse -1 döner
    if not s:
        return -1

    # s'yi temizle (boşlukları ve gereksiz karakterleri kaldır)
    s = s.replace(" ", "")

    # Karakter frekanslarını say
    char_count = Counter(s)

    # Toplam karakter sayısı
    total_chars = len(s)

    # Entropiyi hesapla
    entropy = 0
    for count in char_count.values():
        probability = count / total_chars
        entropy -= probability * math.log2(probability)

    # Maksimum entropi değeri
    num_unique_chars = len(char_count)
    max_entropy = math.log2(num_unique_chars) if num_unique_chars > 1 else 0

    # Normalize entropiyi hesapla
    normalized_entropy = entropy / max_entropy if max_entropy > 0 else 0

    return normalized_entropy  # 4 basamağa yuvarla


def get_url_features(url, index):
    try:
        urlparse(url)
    except ValueError:
        # Eğer URL hatalı bir IPv6 formatına sahipse, None döndür
        print(f"Hatalı URL formatı: {url}, Satır: {index + 1}")
        return {}

    domain, path, directory, query, file_name, file_extension, fragment = cal(url)

    # Yol (path) kısmını bölerken boş liste durumunu kontrol et
    path_tokens = path.split("/")[:-1] if path else []

    # Dosya adı ve uzantısı için kontrol
    file_name = path.split("/")[-1] if path else ""
    file_extension = file_name.split(".")[-1] if file_name and "." in file_name else ""

    features = {
        "Querylength": len(query),  # 0-1385
        "domain_token_count": get_domain_token_count(url),  # 2-19
        "path_token_count": get_path_token_count(path),  # 0-68
        "avgdomaintokenlen": get_avg_domain_token_len(domain),  # 1.5-29.5
        "longdomaintokenlen": get_long_domain_token_len(domain),  # 2-63
        "avgpathtokenlen": get_avg_path_token_len(path),  # 0-105.0 ve NaN
        "tld": get_tld_risk_for_url(url),  # 2-19
        "charcompvowels": get_char_comp_vowels(url),  # 0-192
        "charcompace": get_char_comp_ace(url),  # 0-142
        "ldl_url": calculate_ldl(url),  # 0-207
        "ldl_domain": calculate_ldl(domain),  # 0-37
        "ldl_path": calculate_ldl(path),  # 0-207
        "ldl_filename": calculate_ldl(file_name),  # 0-33
        "ldl_getArg": calculate_ldl(query),  # 0-207
        "dld_url": calculate_dld(url),  # 0-38
        "dld_domain": calculate_dld(domain),  # 0-25
        "dld_path": calculate_dld(path),  # 0-32
        "dld_filename": calculate_dld(file_name),  # 0-23
        "dld_getArg": calculate_dld(query),  # 0-31
        "urlLen": len(url),  # 19-1424
        "domainlength": len(domain),  # 4-227
        "pathLength": len(path),  # 0-1402
        "subDirLen": len(directory),  # 0-1402
        "fileNameLen": len(file_name),  # 1-226
        "this.fileExtLen": len(file_extension),  # 1-5
        "ArgLen": arg_len(query),  # 0-1388 # düzenle
        "pathurlRatio": calculate_raito(len(path), len(url)),  # 0-0.98
        "ArgUrlRatio": calculate_raito(arg_len(query), len(url)),  # 0-93.53
        "argDomanRatio": calculate_raito(arg_len(query), len(domain)),  # 0-90.53
        "domainUrlRatio": calculate_raito(len(domain), len(url)),  # 0.03-0.94
        "pathDomainRatio": calculate_raito(len(path), len(domain)),  # 0-2.9
        "argPathRatio": calculate_raito(arg_len(query), len(path)),  # 0-0.99, 2 ve sonsuz
        "executable": is_executable(path),  # 0/1
        "isPortEighty": is_port_eighty(url),  # -1/0
        "NumberofDotsinURL": url.count("."),  # 1-20
        "ISIpAddressInDomainName": (0 if re.match(r"\d+\.\d+\.\d+\.\d+", domain) else -1),  # sadece -1 durumu gözlenmiş
        "CharacterContinuityRate": calculate_character_continuity_rate(url),  # 0.0-1.0
        "LongestVariableValue": calculate_longest_variable_value_from_query(query),  # -1 durumu incelenmeli + 0-1385 -1 query yoksa
        "URL_DigitCount": calculate_digit_count(url),  # 0-236
        "host_DigitCount": calculate_digit_count(domain),  # 0-236
        "Directory_DigitCount": calculate_digit_count(directory),  # -1 durumu incelenmeli + 0-86
        "File_name_DigitCount": calculate_digit_count(file_name),  # -1 durumu incelenmeli + 0-110
        "Extension_DigitCount": calculate_digit_count(file_extension),  # -1 durumu incelenmeli + 0-236
        "Query_DigitCount": calculate_digit_count(query),  # -1 gözlenmiş + 0-236
        "URL_Letter_Count": calculate_letter_count(url),  # 10-1202
        "host_letter_count": calculate_letter_count(domain),  # 2-189
        "Directory_LetterCount": calculate_letter_count(directory),  # -1 gözlenmiş 0-183
        "Filename_LetterCount": calculate_letter_count(file_name),  # -1 durumu incelenmeli + 0-186
        "Extension_LetterCount": calculate_letter_count(file_extension),  # -1 durumu incelenmeli + 0-1179
        "Query_LetterCount": calculate_letter_count(query),  # -1 gözlenmiş 0-1173
        "LongestPathTokenLength": (max([len(token) for token in path.split("/")]) if path else 0),  # kontrol edilecek + 0-1393
        "Domain_LongestWordLength": (max([len(token) for token in domain.split(".")]) if domain else 0),  # kontrol edilecek + 2-40
        "Path_LongestWordLength": (max([len(token) for token in path.split("/")]) if path else 0),  # kontrol edilecek + 0-99
        "sub-Directory_LongestWordLength": (max([len(token) for token in directory.split("/")]) if directory else -1),  # -1 durumu incelenmeli + 0-48; Boş liste durumunda 0 döner
        "Arguments_LongestWordLength": arguments_longest_word_length(query),  # -1 gözlenmiş 0-91
        "URL_sensitiveWord": count_sensitive_words(url),  # 0-3
        "URLQueries_variable": url_queries_variable(query),  # 0-19
        "spcharUrl": unique_special_char_count(url),  # Her tür sadece 1 kez sayılır 1-17
        "delimeter_Domain": len(re.findall(r"[.\-_]", domain)),  # 0-10
        "delimeter_path": len(re.findall(r"[\/]", path)),  # 0-64
        "delimeter_Count": calculate_delimeter_count(url),  # -1 gözlenmiş 0-37
        "NumberRate_URL": number_rate(url, url),  # 0-0.76
        "NumberRate_Domain": number_rate(domain, domain),  # 0-0.73
        "NumberRate_DirectoryName": number_rate(directory, directory),  # -1 gözlenmiş ve NaN + 0-0.93
        "NumberRate_FileName": number_rate(file_name, file_name),  # -1 ve NaN gözlenmiş + 0-1.0
        "NumberRate_Extension": number_rate(file_extension, file_extension),  # -1 ve NaN gözlenmiş + 0-1.0
        "NumberRate_AfterPath": number_rate((query + fragment), (query + fragment)),  # -1 ve NaN gözlenmiş + 0-1.0
        "SymbolCount_URL": symbol_count(url),  # 2-47
        "SymbolCount_Domain": symbol_count(domain),  # 1-18
        "SymbolCount_Directoryname": symbol_count(directory),  # -1 gözlenmiş + 0-24
        "SymbolCount_FileName": symbol_count(file_name),  # -1 gözlenmiş + 0-40
        "SymbolCount_Extension": symbol_count(file_extension),  # -1 gözlenmiş + 0-39
        "SymbolCount_Afterpath": symbol_count(query + fragment),  # -1 gözlenmiş + 0-39
        "Entropy_URL": calculate_entropy(url),  # 0.51-0.9
        "Entropy_Domain": calculate_entropy(domain),  # 0.57-1.0
        "Entropy_DirectoryName": calculate_entropy(path),  # -1 ve NaN durumu incelenmeli + 0-0.69
        "Entropy_Filename": calculate_entropy(file_name),  # -1 ve NaN durumu incelenmeli + 0-1.0
        "Entropy_Extension": calculate_entropy(file_extension),  # -1 ve NaN durumu incelenmeli + 0-0.93
        "Entropy_Afterpath": calculate_entropy(query + fragment),  # -1 ve NaN durumu incelenmeli + 0-0.93
        "URL_Type_obf_Type": None,  # Bu sütun, CSV'den gelen 'type' sütunu ile doldurulacak
    }
    return features

# # CSV dosyasını oku
# input_csv = "pars_state/kontrol.csv"  # URL ve etiketlerin bulunduğu CSV dosyası
# df = pd.read_csv(input_csv)

# # URL'leri özelliklere ayır ve etiketleri koru
# features_list = []
# for index, row in df.iterrows():
#     url = row["url"]
#     url_type = row["type"]  # 'type' sütunundaki değer
#     features = get_url_features(url, index)
#     features["URL_Type_obf_Type"] = (
#         url_type  # 'type' sütununu 'URL_Type_obf_Type' sütununa aktar
#     )
#     features_list.append(features)

# # Yeni DataFrame oluştur
# output_df = pd.DataFrame(features_list)

# # CSV olarak kaydet
# output_csv = "kontrolV2.csv"
# output_df.to_csv(output_csv, index=False)

# print(f"Özellikler başarıyla çıkarıldı ve '{output_csv}' dosyasına kaydedildi.")