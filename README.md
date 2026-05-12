# URLDet - URL Security Analysis Extension

![URLDet Logo](https://urldet.masahin.dev/android-icon-72x72.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Version](https://img.shields.io/badge/version-3.2.3-blue.svg)](https://github.com/SahinMuhammetAbdullah/urldet-extension/releases)  [![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-available-brightgreen?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/urldet-url-g%C3%BCvenlik-anali/phjancankjcbmdjcdlipmhlnjhljakjf) [![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow?logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![Flask API](https://img.shields.io/badge/API-Flask-black?logo=flask&logoColor=white)](https://github.com/SahinMuhammetAbdullah/urldet-api) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./.github/CONTRIBUTING.md)

URLDet is a browser extension that enhances your online security by analyzing URLs in real-time. It integrates directly into Google search results, providing instant visual feedback on link safety, and offers a side panel for manual URL analysis. This project is the output of a graduation project.

[**See the Frontend (Website)**](https://urldet.masahin.dev/) | [**See the Browser Extension**](https://chrome.google.com/webstore/detail/phjancankjcbmdjcdlipmhlnjhljakjf) | [**Read in Turkish (Türkçe Oku)**](./README.tr.md)

## 🔗 Related Repositories

| Repository | Description |
|---|---|
| [**urldet-extension**](https://github.com/SahinMuhammetAbdullah/urldet-extension) | Chrome extension source code (this repo) |
| [**urldet-web**](https://github.com/SahinMuhammetAbdullah/urldet-web) | React-based website for manual URL analysis and project showcase |
| [**urldet-api**](https://github.com/SahinMuhammetAbdullah/urldet-api) | Flask backend API powering the ML-based URL analysis engine |

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
  - The extension currently points to a remote API server. For local development, follow the setup steps in the [urldet-api repository](https://github.com/SahinMuhammetAbdullah/urldet-api) to run the API locally, then replace the API address in the code with your local IP.

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
   - Open Chrome and navigate to `chrome://extensions`.
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