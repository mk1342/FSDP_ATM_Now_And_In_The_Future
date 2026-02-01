// Session ID generation
const sessionID = 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
document.getElementById('sessionId').textContent = sessionID;

// Web Speech API
let recognition;
let isRecording = false;
let mediaRecorder;
let audioChunks = [];
let recordingStartTime;
let timerInterval;

// Text-to-Speech
let isSpeaking = false;
let currentUtterance = null;
const synth = window.speechSynthesis;

// Initialize Web Speech API
function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('Speech Recognition not supported');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log('[record] started');
        isRecording = true;
        document.getElementById('voiceBtn').classList.add('recording');
        document.getElementById('recordingTimer').style.display = 'block';
        recordingStartTime = Date.now();
        startTimer();
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        if (interimTranscript) {
            document.getElementById('interimTranscript').style.display = 'block';
            document.getElementById('interimText').textContent = interimTranscript;
        }

        if (finalTranscript) {
            document.getElementById('userInput').value = finalTranscript.trim();
            document.getElementById('interimTranscript').style.display = 'none';
        }
    };

    recognition.onend = () => {
        console.log('[record] ended');
        isRecording = false;
        document.getElementById('voiceBtn').classList.remove('recording');
        document.getElementById('recordingTimer').style.display = 'none';
        clearInterval(timerInterval);
        // Auto-send after recording ends
        if (document.getElementById('userInput').value.trim()) {
            sendMessage();
        }
    };

    recognition.onerror = (event) => {
        console.error('[record] error:', event.error);
        document.getElementById('voiceBtn').classList.remove('recording');
    };
}

function toggleVoiceRecording() {
    if (!recognition) initializeSpeechRecognition();
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function startTimer() {
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timerDisplay').textContent = seconds + 's';
    }, 1000);
}

// Intent detection
function detectIntent(text) {
    const lowerText = text.toLowerCase();
    
    if (/balance|account|money|how much/.test(lowerText)) {
        return 'balance';
    } else if (/fee|charge|cost|price/.test(lowerText)) {
        return 'fees';
    } else if (/transfer|send|pay/.test(lowerText)) {
        return 'transfer';
    } else if (/navigate|go to|show|view/.test(lowerText)) {
        return 'navigation';
    }
    return 'unknown';
}

// Account data
function simulateAccount() {
    return {
        accountNumber: '***1234',
        accountType: 'Savings',
        balance: 'S$ 12,450.75',
        currency: 'SGD'
    };
}

function getSecondaryAccount() {
    return {
        accountNumber: '***5678',
        accountType: 'Current',
        balance: 'S$ 8,230.20',
        currency: 'SGD'
    };
}

// Build response UI based on intent
function buildBalanceCard() {
    const account = simulateAccount();
    const secondary = getSecondaryAccount();
    return `
        <div class="account-card">
            <div class="account-item">
                <div class="account-type">${account.accountType} Account</div>
                <div class="account-balance">${account.balance}</div>
                <div class="account-number">${account.accountNumber}</div>
            </div>
            <div class="account-item">
                <div class="account-type">${secondary.accountType} Account</div>
                <div class="account-balance">${secondary.balance}</div>
                <div class="account-number">${secondary.accountNumber}</div>
            </div>
        </div>
    `;
}

function buildFaqResponse(topic) {
    const faqs = {
        fees: [
            { q: 'What are ATM withdrawal fees?', a: 'Free for OCBC ATMs, S$2-3 for other banks.' },
            { q: 'Transfer fee?', a: 'Fast transfer within OCBC: Free. InterBank: S$1-2.' }
        ],
        transfer: [
            { q: 'How to transfer funds?', a: 'Select Transfer, enter recipient account, confirm amount.' },
            { q: 'Transfer limits?', a: 'Daily limit: S$50,000. Per transaction: S$100,000.' }
        ]
    };
    const items = faqs[topic] || [];
    return `
        <div class="faq-container">
            ${items.map(item => `
                <div class="faq-item">
                    <div class="faq-question">${item.q}</div>
                    <div class="faq-answer">${item.a}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Text-to-Speech function
function speakResponse(text) {
    // Stop any current speech
    if (isSpeaking) {
        synth.cancel();
    }

    // Extract plain text from HTML if needed
    const plainText = text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    
    if (!plainText) return;

    currentUtterance = new SpeechSynthesisUtterance(plainText);
    currentUtterance.rate = 1.0;
    currentUtterance.pitch = 1.0;
    currentUtterance.volume = 1.0;

    currentUtterance.onstart = () => {
        isSpeaking = true;
        document.getElementById('speakingIndicator').style.display = 'flex';
        document.getElementById('stopSpeechBtn').style.display = 'flex';
        console.log('[speak] started');
    };

    currentUtterance.onend = () => {
        isSpeaking = false;
        document.getElementById('speakingIndicator').style.display = 'none';
        document.getElementById('stopSpeechBtn').style.display = 'none';
        console.log('[speak] ended');
    };

    currentUtterance.onerror = (event) => {
        console.error('[speak] error:', event.error);
        isSpeaking = false;
        document.getElementById('speakingIndicator').style.display = 'none';
        document.getElementById('stopSpeechBtn').style.display = 'none';
    };

    synth.speak(currentUtterance);
}

function stopSpeech() {
    synth.cancel();
    isSpeaking = false;
    document.getElementById('speakingIndicator').style.display = 'none';
    document.getElementById('stopSpeechBtn').style.display = 'none';
}

// Send message
function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    input.value = '';

    // Detect intent
    const intent = detectIntent(text);
    console.log('[send]', { intent, text, sessionID });

    // Generate response based on intent
    let responseHTML = '';
    let responseText = '';
    
    if (intent === 'balance') {
        responseHTML = buildBalanceCard();
        responseText = 'Here are your account balances. You have a Savings account with S$ 12,450.75 and a Current account with S$ 8,230.20.';
    } else if (intent === 'fees') {
        responseHTML = buildFaqResponse('fees');
        responseText = 'OCBC ATM withdrawals are free. InterBank transfers cost S$ 1 to 2. Fast transfers within OCBC are free.';
    } else if (intent === 'transfer') {
        responseHTML = buildFaqResponse('transfer');
        responseText = 'To transfer funds, select Transfer, enter the recipient account, and confirm the amount. Your daily limit is S$ 50,000 per transaction.';
    } else {
        responseHTML = '<p>I can help you with account balance, fees, transfers, or navigation. What would you like to know?</p>';
        responseText = 'I can help you with account balance, fees, transfers, or navigation. What would you like to know?';
    }

    // Add assistant response
    addMessage(responseHTML, 'assistant');
    
    // Speak the response
    speakResponse(responseText);

    // Persist to backend
    persistMessage(text, intent, responseHTML);
}

function addMessage(content, sender) {
    const container = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${content}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Persist to backend
async function persistMessage(userText, intent, responseHTML) {
    try {
        const payload = {
            sessionID,
            sender: 'user',
            text: userText,
            intent,
            response: responseHTML,
            timestamp: new Date().toISOString()
        };

        const response = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('[persist]', data);
    } catch (error) {
        console.error('[persist] error:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeSpeechRecognition();
});
