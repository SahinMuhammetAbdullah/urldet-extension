# URLDet - URL Security Analysis Extension

![URLDet Logo](https://urldet.masahin.dev/android-icon-72x72.png)

URLDet is a browser extension that enhances your online security by analyzing URLs in real-time. It integrates directly into Google search results, providing instant visual feedback on link safety, and offers a side panel for manual URL analysis. This project is the output of a graduation project.

[**Visit the Website**](https://urldet.masahin.dev) | [**Read in Turkish (Türkçe Oku)**](./README.tr.md)


## ✨ Features

- **Real-Time Analysis:** Automatically scans URLs on Google search result pages.
- **Visual Indicators:** Adds safety icons (safe, phishing, malware, etc.) directly next to search result links.
- **Side Panel for Manual Analysis:** Open the side panel to manually enter and analyze any URL.
- **Detailed Results:** Get a comprehensive breakdown of the analysis, including risk scores and threat types.
- **Multi-Language Support:** The interface is available in both English and Turkish.
- **Light & Dark Mode:** A comfortable viewing experience for any time of day.

## 🛠️ Built With

- **Frontend (Website):** [React](https://reactjs.org/)
- **Frontend (Extension):** HTML, CSS, Vanilla JavaScript
- **Backend (API):** [Flask](https://flask.palletsprojects.com/)
- **Analysis Engine:** Machine Learning models (Random Forest, Deep Q-Network)

## 🚀 Getting Started

To get a local copy up and running for development purposes, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- A running instance of the URLDet Flask API.

### Installation (for Development)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/SahinMuhammetAbdullah/urldet-extension.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd urldet-extension
   ```
3. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://urldet-extensions`.
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked" and select the project folder you cloned.

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see [`CONTRIBUTING.md`](./.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Muhammet Abdullah Şahin - [GitHub Profile](https://github.com/SahinMuhammetAbdullah)

Project Link: [https://github.com/SahinMuhammetAbdullah/urldet-extension](https://github.com/SahinMuhammetAbdullah/urldet-extension)