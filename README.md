# VoiceAgent - ElevenLabs Conversational AI

A simple web application that allows you to have voice conversations with an AI agent using ElevenLabs technology.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/MonoBGun/ConversationalAI.git
cd ConversationalAI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your ElevenLabs credentials:
```
ELEVENLABS_API_KEY=your_api_key
ELEVENLABS_AGENT_ID=your_agent_id
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and go to:
```
http://localhost:5173
```

## Usage

1. Click "Start Conversation" to begin
2. Allow microphone access when prompted
3. Speak to the AI agent
4. Click "Stop Conversation" to end the session
5. View and download the conversation transcript

## Features

- Real-time voice conversation with AI
- Automatic transcript generation
- Downloadable conversation history
- Simple and intuitive interface

## Project Structure

- `index.html` - Main HTML file
- `script.js` - Frontend JavaScript
- `server.js` - Backend server
- `styles.css` - Styling
- `package.json` - Project configuration and dependencies 