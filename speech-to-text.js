const Groq = require("groq-sdk");
const fs = require("fs");
require('dotenv').config();

const groq_api_key = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey: groq_api_key });

async function processFile(filePath) {
    try {
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "distil-whisper-large-v3-en",
            language: "en",
            temperature: 0.0,
        });

        console.log("Transcription text:", transcription.text);
        return transcription.text;
    } catch (error) {
        console.error("Error during transcription:", error);
        throw error;
    }
}

async function summarizeText(description) {
    const response = await groq.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { 
                role: "user", 
                content: `${description} - Shorten this sentence to about 25% of its original length, while still prioritizing keeping detail.` 
            },
        ],
        model: "llama3-8b-8192",
    });

    const summary = response.choices[0].message.content;
    console.log("Summary:", summary);
    return summary;
}

module.exports = { processFile, summarizeText };