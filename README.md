# Emotional Intelligence Coach

[![Netlify Status](https://api.netlify.com/api/v1/badges/36b277b2-8e6a-44bf-9351-051f9ec5e8fd/deploy-status)](https://app.netlify.com/projects/emotional-intelligence-coach/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> An intelligent web application that analyzes your emotional state through **text tone analysis** and **facial expression detection**, then provides personalized social skills coaching advice.

## Live Demo

**[View Live Demo](https://emotional-intelligence-coach.netlify.app)**

## Screenshots

| Emotion Analysis | Coaching Output |
|:---:|:---:|
| Text tone + facial expression detection | Personalized coaching advice |

## Features

### Text Tone Analysis
- Rule-based sentiment detection analyzing user input
- Detects 5 emotional categories: **Positive**, **Neutral**, **Negative**, **Anxious**, and **Angry**
- Real-time keyword matching for accurate emotion detection

### Facial Expression Analysis
- Browser-based camera access using WebRTC
- Real-time facial expression detection powered by **face-api.js**
- Detects emotions: Happy, Sad, Angry, Surprised, Neutral, Fearful, Disgusted
- Visual feedback with face bounding boxes and emotion labels
- **Privacy-first** — all processing happens locally in your browser

### Intelligent Coaching Output
- Context-aware advice based on combined text tone and facial expression
- Practical, actionable social skills guidance
- Multiple coaching strategies for different emotional combinations

### Fail-Safe Design
- Graceful handling of camera permission denials
- Text-only mode when camera is unavailable
- Clear error messages and user guidance
- Works offline after initial load

## Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Responsive design with gradients and animations |
| **Vanilla JavaScript** | Core application logic (ES6+) |
| **face-api.js** | Lightweight facial expression detection |
| **WebRTC** | Browser camera access |

## Getting Started

### Prerequisites
- A modern web browser (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)
- A local HTTP server (for camera access)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhishekpat/emotional-intelligence-coach.git
   cd emotional-intelligence-coach
   ```

2. **Start a local server**

   Using Python:
   ```bash
   python -m http.server 8000 -d public
   ```

   Using Node.js:
   ```bash
   npx serve public
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## Usage

1. **Start the Camera** (optional) — Click "Start Camera" and grant camera permission
2. **Enter Your Feelings** — Type how you're feeling in the text area
3. **Analyze** — Click "Analyze My Emotions" and wait for processing
4. **Read Coaching Advice** — Review personalized advice based on your emotions

## Privacy & Security

- **100% Client-Side** — All processing happens in your browser
- **No Data Transmission** — Nothing is sent to any server
- **No Tracking** — No analytics or third-party scripts
- **Camera Privacy** — Video stream is never recorded or stored
- **Offline Capable** — Works without internet after initial load

## Browser Compatibility

| Browser | Version | Status |
|---|---|---|
| Chrome | 70+ | Supported |
| Firefox | 65+ | Supported |
| Safari | 12+ | Supported |
| Edge | 79+ | Supported |
| Opera | 60+ | Supported |

## Future Enhancements

- Multi-language support
- Voice tone analysis
- Emotion tracking over time
- Downloadable emotion reports
- Advanced coaching techniques library

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

**Built with care for emotional wellness and social skills development**
