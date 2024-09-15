import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import ffmpeg from 'fluent-ffmpeg';
const app = express();
const port = 3000;

dotenv.config();
ffmpeg.setFfmpegPath("C:/ffmpeg/ffmpeg-2024-09-12-git-504c1ffcd8-full_build/bin/ffmpeg.exe");

const groq_api_key = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: groq_api_key });

const repoOwner = "jotigokaraju";
const repoName = "sensescript";
const filePath = "instructions.txt";

// GitHub API URL
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

// Your GitHub access token
const accessToken = process.env.GHUB_ACCESS_TOKEN;
let fileName;
let description;
let newFileName;

app.use(cors());

function convertToMp3(inputFilePath, outputFilePath) {
    ffmpeg(inputFilePath)
        .toFormat('mp3')
        .on('end', () => {
            console.log('Conversion completed!');
        })
        .on('error', (err) => {
            console.error('Error during conversion:', err);
        })
        .save(outputFilePath);
}
async function transcriptionCreation() {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream("../convex/upload/" + newFileName),
      model: "distil-whisper-large-v3-en",
      language: "en", 
    });
  
    console.log(`TRANSCRIBED: ${transcription.text}`);
  
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Shorten the sentence to about 25% of its original length, while still prioritizing keeping detail, and if this is not a complete sentence, return the words, 'Sorry, I could not understand. '",
        },
        {
          role: "user",
          content: `Here is the sentence: ${transcription.text}`,
        },
      ],
      model: "llama3-8b-8192",
    });
    console.log(`RESPONSE: ${response.choices[0].message.content}`);
    if (response.choices[0].message.content === "Sorry, I could not understand.") description = "";
    else description = response.choices[0].message.content;

}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function unlinkFiles() {
  await sleep(10000);
  fs.unlink('./upload/test.mp3', (err) => {
    if (err) {
        console.error('Error while deleting file:', err);
    } else {
        console.log('File deleted successfully!');
    }
  });
  fs.unlink('./upload/' + newFileName, (err) => {
    if (err) {
        console.error('Error while deleting file:', err);
    } else {
        console.log('File deleted successfully!');
    }
  });
}

async function updateGitHubFile(newContent) {
    try {
        // Fetch the current file content
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching file: ${response.status}`);
        }

        const responseData = await response.json();

        // Decode the current content from Base64
        const currentContent = responseData.content;
        const currentContentDecoded = atob(currentContent);

        // Update the content with the new content (replace INPUT here with your transcription variable)
        const updatedContent = newContent;

        // Encode the new content to Base64
        const newContentEncoded = btoa(updatedContent);

        // Prepare the data for the PUT request
        const data = {
            message: "Update instructions.txt with instructions",
            content: newContentEncoded,
            sha: responseData.sha // required to update the file
        };

        // Send the updated content to GitHub
        const updateResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (updateResponse.ok) {
            console.log("File updated successfully!");
        } else {
            console.error(`Error updating file. Status code: ${updateResponse.status}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}


if (!fs.existsSync('upload')) {
    fs.mkdirSync('upload');
}
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = 'upload/';
      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Use the original name of the file
      const ext = path.extname(file.originalname); // Get the file extension
      const basename = path.basename(file.originalname, ext); // Get the base name without extension
      newFileName = `${basename}-${Date.now()}${ext}`; // Add timestamp to ensure unique name
      cb(null, newFileName);
      main();
    }
});
  
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Optional: limit file size (10 MB in this case)
});
// Handle POST request to /upload
app.post('/upload', upload.single('video'), (req, res) => {
  // req.file contains the uploaded file
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Optionally, you can handle further processing of the file here

  // Respond with success message
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function main() {
    const inputVideo = path.join('upload', newFileName);
    const outputAudio = path.join('upload', 'test.mp3');

    convertToMp3(inputVideo, outputAudio);
    
    
    
    // Function to update the file
    transcriptionCreation();

    unlinkFiles();
    // Call the function with your transcription content
    updateGitHubFile(description);
}
