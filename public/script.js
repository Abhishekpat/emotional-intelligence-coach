let videoStream = null;
let faceDetectionActive = false;
let currentFacialExpression = null;

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

const emotionKeywords = {
    positive: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'good', 'love', 'excellent', 'perfect', 'blessed', 'grateful', 'cheerful', 'delighted', 'pleased', 'content', 'optimistic', 'hopeful'],
    negative: ['sad', 'depressed', 'terrible', 'awful', 'bad', 'hate', 'worst', 'horrible', 'miserable', 'unhappy', 'disappointed', 'upset', 'hurt', 'pain', 'crying', 'lonely', 'hopeless', 'empty'],
    anxious: ['worried', 'anxious', 'nervous', 'stressed', 'fear', 'scared', 'panic', 'overwhelmed', 'tense', 'uneasy', 'restless', 'concerned', 'frightened', 'afraid', 'terrified'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'pissed', 'outraged', 'hostile', 'bitter', 'resentful', 'livid']
};

const coachingAdvice = {
    positive_happy: [
        "Wonderful! Your positive energy is contagious. Share this joy with others today.",
        "Keep radiating this positivity. Consider journaling what made you feel this way.",
        "Great emotional state! Use this momentum to tackle challenging tasks."
    ],
    positive_neutral: [
        "Your positive mindset is showing! Stay grounded and maintain this balanced energy.",
        "Good emotional awareness. Channel this positivity into meaningful connections.",
        "Nice balance! Your optimistic words can inspire those around you."
    ],
    negative_sad: [
        "It's okay to feel sad. Acknowledge your emotions without judgment.",
        "Consider reaching out to a trusted friend or counselor. You don't have to face this alone.",
        "Try gentle self-care: a short walk, listening to calming music, or deep breathing exercises."
    ],
    negative_angry: [
        "Strong emotions detected. Take 5 deep breaths before responding to any situation.",
        "Your feelings are valid. Consider physical activity to channel this energy constructively.",
        "Pause and reflect: What's the core need behind this anger? Address that need calmly."
    ],
    anxious_neutral: [
        "Anxiety is your body's alarm system. Ground yourself with the 5-4-3-2-1 technique.",
        "Break overwhelming tasks into tiny, manageable steps. Progress reduces anxiety.",
        "Practice mindful breathing: 4 counts in, hold for 4, exhale for 4. Repeat 5 times."
    ],
    anxious_surprised: [
        "Unexpected situations can trigger anxiety. Focus on what you can control right now.",
        "Your awareness is the first step. Write down your worries, then challenge each one.",
        "Reach out for support. Talking about anxiety often reduces its power."
    ],
    angry_angry: [
        "Take a timeout before acting. Your future self will thank you for pausing now.",
        "Physical release helps: try intense exercise, punching a pillow, or tearing paper.",
        "Ask yourself: Will this matter in a week? A month? A year? Perspective reduces rage."
    ],
    neutral_neutral: [
        "Stable emotional state detected. Great time for reflection and planning.",
        "Use this balanced energy to practice gratitude or set meaningful goals.",
        "Consider reaching out to someone—connection enriches even neutral moments."
    ],
    positive_sad: [
        "Interesting contrast between your words and expression. Trust your body's signals too.",
        "Sometimes we try to stay positive while struggling inside. It's okay to acknowledge pain.",
        "Balance optimism with honesty about your feelings. Both emotions can coexist."
    ],
    negative_happy: [
        "Your facial expression suggests resilience despite difficult feelings. That's strength.",
        "The smile might be masking pain. Be gentle with yourself and seek support if needed.",
        "Sometimes we smile through pain. Honor both your struggle and your courage."
    ],
    default: [
        "Self-awareness is powerful. Keep checking in with your emotions regularly.",
        "Every emotion has value. They're messengers telling you what you need.",
        "Practice emotional literacy: Name your feelings, accept them, then decide your response."
    ]
};

async function initializeFaceAPI() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        return true;
    } catch (error) {
        console.error('Error loading face-api models:', error);
        return false;
    }
}

async function startCamera() {
    const startBtn = document.getElementById('startCamera');
    const statusDiv = document.getElementById('cameraStatus');
    const video = document.getElementById('video');

    try {
        startBtn.disabled = true;
        statusDiv.textContent = 'Requesting camera access...';
        statusDiv.className = 'status-message info';

        const modelsLoaded = await initializeFaceAPI();
        if (!modelsLoaded) {
            throw new Error('Failed to load face detection models');
        }

        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });

        video.srcObject = videoStream;

        video.addEventListener('loadedmetadata', () => {
            const canvas = document.getElementById('overlay');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });

        statusDiv.textContent = 'Camera active! Face detection ready.';
        statusDiv.className = 'status-message success';
        startBtn.textContent = 'Camera Running';
        startBtn.style.background = '#51cf66';

        faceDetectionActive = true;

    } catch (error) {
        console.error('Camera error:', error);

        let errorMessage = 'Camera access denied or unavailable. You can still use text analysis.';

        if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera permission denied. Please enable camera access in browser settings to use facial analysis.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera found. You can still use text-only analysis.';
        }

        statusDiv.textContent = errorMessage;
        statusDiv.className = 'status-message error';
        startBtn.disabled = false;
        faceDetectionActive = false;
    }
}

async function detectFacialExpression() {
    if (!faceDetectionActive) {
        return null;
    }

    const video = document.getElementById('video');
    const canvas = document.getElementById('overlay');
    const ctx = canvas.getContext('2d');

    try {
        const detections = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections) {
            const expressions = detections.expressions;
            const sortedExpressions = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
            const dominantExpression = sortedExpressions[0][0];

            const box = detections.detection.box;
            ctx.strokeStyle = '#51cf66';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            ctx.fillStyle = '#51cf66';
            ctx.fillRect(box.x, box.y - 25, box.width, 25);
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText(dominantExpression, box.x + 5, box.y - 7);

            currentFacialExpression = dominantExpression;
            return dominantExpression;
        } else {
            currentFacialExpression = null;
            return null;
        }
    } catch (error) {
        console.error('Face detection error:', error);
        return null;
    }
}

function analyzeTextTone(text) {
    if (!text || text.trim().length === 0) {
        return 'neutral';
    }

    const lowerText = text.toLowerCase();
    const scores = {
        positive: 0,
        negative: 0,
        anxious: 0,
        angry: 0
    };

    for (const [category, keywords] of Object.entries(emotionKeywords)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                scores[category]++;
            }
        }
    }

    const maxScore = Math.max(...Object.values(scores));

    if (maxScore === 0) {
        return 'neutral';
    }

    const dominantTone = Object.entries(scores).find(([_, score]) => score === maxScore)[0];
    return dominantTone;
}

function getCoachingAdvice(textTone, facialExpression) {
    const key = facialExpression
        ? `${textTone}_${facialExpression}`
        : `${textTone}_neutral`;

    let advice = coachingAdvice[key] || coachingAdvice.default;

    const randomIndex = Math.floor(Math.random() * advice.length);
    return advice[randomIndex];
}

function displayResults(textTone, facialExpression, coaching) {
    const textToneDiv = document.getElementById('textToneResult');
    const facialExpressionDiv = document.getElementById('facialExpressionResult');
    const coachingDiv = document.getElementById('coachingAdvice');

    const toneEmojis = {
        positive: '😊',
        neutral: '😐',
        negative: '😔',
        anxious: '😰',
        angry: '😠'
    };

    const expressionEmojis = {
        happy: '😊',
        sad: '😢',
        angry: '😠',
        surprised: '😲',
        neutral: '😐',
        fearful: '😨',
        disgusted: '🤢'
    };

    textToneDiv.innerHTML = `
        <div class="emotion-badge emotion-${textTone}">
            ${toneEmojis[textTone] || '😐'} ${textTone.toUpperCase()}
        </div>
    `;

    if (facialExpression) {
        facialExpressionDiv.innerHTML = `
            <div class="emotion-badge emotion-${facialExpression === 'happy' ? 'positive' : 'neutral'}">
                ${expressionEmojis[facialExpression] || '😐'} ${facialExpression.toUpperCase()}
            </div>
        `;
    } else {
        facialExpressionDiv.innerHTML = `
            <span style="color: #999;">No face detected or camera not active</span>
        `;
    }

    coachingDiv.innerHTML = `<p>${coaching}</p>`;
}

async function analyzeEmotions() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const textInput = document.getElementById('textInput').value;

    try {
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';

        const textTone = analyzeTextTone(textInput);

        let facialExpression = null;
        if (faceDetectionActive) {
            facialExpression = await detectFacialExpression();
        }

        const coaching = getCoachingAdvice(textTone, facialExpression);

        displayResults(textTone, facialExpression, coaching);

    } catch (error) {
        console.error('Analysis error:', error);

        const coachingDiv = document.getElementById('coachingAdvice');
        coachingDiv.innerHTML = '<p>Analysis completed with limited data. Remember: self-awareness is the first step to emotional growth.</p>';
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze My Emotions';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startCameraBtn = document.getElementById('startCamera');
    const analyzeBtn = document.getElementById('analyzeBtn');

    startCameraBtn.addEventListener('click', startCamera);
    analyzeBtn.addEventListener('click', analyzeEmotions);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const statusDiv = document.getElementById('cameraStatus');
        statusDiv.textContent = 'Camera API not supported in this browser. Text analysis still available.';
        statusDiv.className = 'status-message error';
        startCameraBtn.disabled = true;
    }
});

window.addEventListener('beforeunload', () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
});
