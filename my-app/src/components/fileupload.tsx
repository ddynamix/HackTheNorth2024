import React, { useState } from 'react';

const SingleFileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            console.log('Processing file...');
            
            try {
                // Create a FormData object and append the video file
                const formData = new FormData();
                formData.append('video', file);
                console.log(file);
                
                // Send the file to your backend or directly to the Groq API
                // Assuming backend processes the file and sends it to Groq for transcription
                const response = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData,
                });
            } catch (error) {
                console.error('Error processing file: ' + error);
            }
        }
    };

    return (
        <>
            <input type="file" onChange={handleFileChange} />
            <p>No file chosen</p>

            {file && (
                <div>
                    <p>File details:</p>
                    <p>Name: {file.name}</p>
                    <p>Type: {file.type}</p>
                    <p>Size: {file.size} bytes</p>
                </div>
            )}

            {file && (
                <button onClick={handleUpload} className="submit">
                    Upload and Process File
                </button>
            )}

            {transcription && (
                <div>
                    <h3>Transcription:</h3>
                    <p>{transcription}</p>
                </div>
            )}
        </>
    );
};

export default SingleFileUploader;