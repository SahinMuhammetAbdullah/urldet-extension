import subprocess
import sys

def install_requirements():
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Tüm bağımlılıklar başarıyla yüklendi.")
    except subprocess.CalledProcessError:
        print("Yükleme sırasında bir hata oluştu.")

if __name__ == "__main__":
    install_requirements()
