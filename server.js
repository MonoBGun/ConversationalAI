import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ElevenLabsClient } from "elevenlabs";

dotenv.config();

// Debug logging for environment variables
console.log('Current working directory:', process.cwd());
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? 'Set' : 'Not Set');
console.log('AGENT_ID:', process.env.AGENT_ID ? 'Set' : 'Not Set');

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Store the current conversation ID
let currentConversationId = null;

app.get('/api/get-signed-url', async (req, res) => {
    const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${process.env.AGENT_ID}`,
        {
            method: 'GET',
            headers: {
                // Requesting a signed url requires your ElevenLabs API key
                // Do NOT expose your API key to the client!
                'xi-api-key': process.env.ELEVENLABS_API_KEY,
            },
        }
    );
    if (!response.ok) {
        return res.status(500).json({ error: 'Failed to get signed URL' });
    }
    const body = await response.json();
    res.json({ signedUrl: body.signed_url });
});

// View the conversation data
app.get("/api/conversation/:conversationId", async (req, res) => {
    try {
        const { conversationId } = req.params;
        console.log('Getting transcript for conversation:', conversationId);
        
        const currentConversation = await client.conversationalAi.getConversation(conversationId);
        console.log('Received conversation data');

        // Extract only role and message data from the transcript
        const messages = currentConversation.transcript?.map(msg => ({
            role: msg.role,
            message: msg.message
        })) || [];

        const response = {
            evaluation_criteria: currentConversation.analysis?.evaluation_criteria_results || {},
            transcript_summary: currentConversation.analysis?.transcript_summary || '',
            call_successful: currentConversation.analysis?.call_successful || "unknown",
            messages: messages
        };

        res.json(response);
    }
    catch(error){
        console.error('Error getting transcript:', error);
        res.status(500).json({error:'failed to retrieve transcript'})
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 