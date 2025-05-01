import { Conversation } from '@11labs/client';

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const connectionStatus = document.getElementById('connectionStatus');
const agentStatus = document.getElementById('agentStatus');

// Global variable to track conversation ID
let conversationId = null;
let conversation=null;

async function getSignedUrl() {
    const response = await fetch('/api/get-signed-url');
    if (!response.ok) {
        throw new Error('Failed to get signed URL');
    }
    const data = await response.json();
    return data.signedUrl;
}

async function startConversation() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false 
        });
        
        const signedUrl = await getSignedUrl();
            conversation = await Conversation.startSession({
            signedUrl,
            onConnect: () => {
                connectionStatus.textContent = 'Connected';
                startButton.disabled = true;
                stopButton.disabled = false;
            },
            onDisconnect: () => {
                endConversation();
            },
            onError: (error) => {
                console.error('Conversation error:', error);
            },
            onModeChange: (mode) => {
                agentStatus.textContent = mode.mode === 'speaking' ? 'speaking' : 'listening';
            },
        });

        // Store the conversation ID
        conversationId = conversation.getId();
    } catch (error) {
        console.error('Failed to start conversation:', error);
    }
}

async function endConversation() {
    try {
        if (conversation) {
            await conversation.endSession(); // Ensure the session ends completely
        }

        if (conversationId) {
            // Add a delay to allow the server to process the transcript
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

            // Review the conversation after the delay
            await reviewConversation(conversationId);
        }
    } catch (error) {
        console.error('Error ending conversation:', error);
    } finally {
        conversationId = null;
        startButton.disabled = false;
        stopButton.disabled = true;
    }
}

async function reviewConversation(conversationId) {
    try {
        const response = await fetch(`http://localhost:3001/api/conversation/${conversationId}`);
        if (!response.ok) {
            throw new Error('Failed to get conversation transcript');
        }
        
        const data = await response.json();
        const transcriptContent = document.querySelector('.transcript-content');
        const downloadButton = document.querySelector('.download-button');
        
        if (transcriptContent && downloadButton) {
            transcriptContent.textContent = JSON.stringify(data, null, 2);
            
            downloadButton.onclick = () => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
                a.download = `conversation_${conversationId}.json`;
                a.click();
            };
        }
    } catch (error) {
        console.error('Error reviewing conversation:', error);
    }
}

startButton.addEventListener('click', startConversation);
stopButton.addEventListener('click', endConversation)

// ... rest of the code ...