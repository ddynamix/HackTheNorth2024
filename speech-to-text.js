const Groq = require("groq-sdk");
const fs = require("fs");
require('dotenv').config();


let description;
const groq_api_key = process.env.GROQ_API_KEY;

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});


const chatCompletion = async () => {

}

async function main() {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream("wikipedia_ai.mp3"), // Required path to audio file - replace with your audio file!
    model: "distil-whisper-large-v3-en", // Required model to use for transcription
    language: "en", // Optional
    temperature: 0.0, // Optional
  });

  console.log(transcription.text);
  description = transcription.text;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "you are a helpful assistant.",
      },
      {
        role: "user",
        content: `${description} - Shorten this sentence to about 25% of its original length, while still prioritizing keeping detail.`,
      },
    ],
    model: "llama3-8b-8192",
  });
  console.log(response.choices[0].message.content);
}

main();




