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
                formData.append('file', file);
                
                // Send the file to your backend or directly to the Groq API
                // Assuming backend processes the file and sends it to Groq for transcription
                const response = await fetch('https://<your_server_endpoint>', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                
                // Assuming that the backend responds with the transcription
                console.log('Transcription:', data.transcription);
                setTranscription(data.transcription);

                // Optionally, you can now send this transcription to a Raspberry Pi
                await sendToRaspberryPi(data.transcription);
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }
    };

    const sendToRaspberryPi = async (transcription: string) => {
        try {
            const response = await fetch('http://10.37.101.146/transcription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcription }),
            });

            if (response.ok) {
                console.log('Transcription sent to Raspberry Pi successfully');
            } else {
                console.error('Failed to send transcription to Raspberry Pi');
            }
        } catch (error) {
            console.error('Error sending transcription to Raspberry Pi:', error);
        }
    };

    return (
        <>
            <input type="file" onChange={handleFileChange} />

            {file && (
                <div>

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