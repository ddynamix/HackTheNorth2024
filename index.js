require('dotenv').config();

const body = new FormData();
body.append('file', 'https://output.lemonfox.ai/wikipedia_ai.mp3');
body.append('language', 'english');
body.append('response_format', 'json');

let description;
console.log(process.env.LEMONFOX_API_KEY);

fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer: ' + process.env.LEMONFOX_API_KEY
  },
  body: body
})
.then(response => response.json()).then(data => {
  description = data['text'];
  
})
.catch(error => {
  console.error('Error:', error);
});

//description = long-form speech-to-text


