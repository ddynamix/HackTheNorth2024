'''
Note for HTN Organizers
The app is deployed on a private repository since it contains a lot of personal information
If you want to see the commit history of the private repo - just slack message me
'''

# Import Libraries
import streamlit as st
from streamlit_mic_recorder import mic_recorder, speech_to_text
import requests
import base64
from gtts import gTTS
from transformers import pipeline
from PIL import Image

caption = None
word = []

# Models
sentiment = None
    
@st.cache_resource
def load_model():
    return pipeline("image-to-text", model="Salesforce/blip-image-captioning-large")

@st.cache_resource
def sentiment_model():
    return pipeline(task="text-classification", model="SamLowe/roberta-base-go_emotions", top_k=None)

@st.cache_resource
def summary_model():
    return pipeline("summarization", model="Falconsai/text_summarization")

# Repo Details
repo_owner = REDACTED
repo_name = REDACTED
file_path = "REDACTED

# GitHub API URL
api_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path}"

# HIDE
access_token = REDACTED

state = st.session_state

if 'text_received' not in state:
    state.text_received = []

if 'img_received' not in state:
    state.img_received = []

state.selected_text = None
converting_text = None

# Define a dictionary mapping characters to Braille Unicode characters
braille_dict = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙',
    '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
    '0': '⠼⠚', ',': '⠂', ';': '⠆', ':': '⠒', '.': '⠲',
    '/': '⠌', '!': '⠮', '?': '⠦', "'": '⠄', '"': '⠐⠄',
    '-': '⠤', '(': '⠐⠣', ')': '⠐⠜', ' ': ' '
}

def word_to_braille(text):
    """Convert English text to Braille characters."""
    braille_text = ''.join(braille_dict.get(char, '') for char in text.lower())
    return braille_text

st.title(":red[Perceiv/io]")
st.header("Helping Make The World Accessible for the Deafblind")
st.divider()

# Recorder and Transcriber
st.header("Speech-to-Text Converter")
st.write("Record and transcribe your speech.")

# Speech-to-text recorder
text = speech_to_text(language='en', start_prompt="Start 🔴", stop_prompt="Stop 🟥", use_container_width=True, just_once=True, key='STT')

state.selected_text = None
if sentiment is None:
    classifier = sentiment_model()
            
# Always render the speech_to_text component
if text is not None:
    state.text_received.append(text)

# Display success message if text is recognized
if text:
    st.success("Speech recognized successfully!")
    
# Display recognition status and translated text
st.write("Translated text:")
for index, translated_text in enumerate(state.text_received):
    st.write(f"{index + 1}. {translated_text}")
    word.append(translated_text)

if state.text_received:
    st.header("Select Text")
    stext = st.selectbox("Select recorded text:", state.text_received)

if st.button("Sentiment Analysis", type="primary"):
    sentences = []
    sentences.append(stext)
    model_outputs = classifier(sentences)
    max_score_label = max(model_outputs[0], key=lambda x: x['score'])
    label = max_score_label['label']
    label_cap = label[0].upper() + label[1:]
    
    state.converting_text = f"{stext} /{label[:2]}"

    st.success(f"Detected Sentiment: {label_cap}")
    st.success(f"Transcribed word: {state.converting_text}")

state.selected_text = None
caption_of_image = None
caption_text = None
if caption is None:
    caption = load_model()
    
st.header("Image Captioning")
st.write("Take an Image to Return an AI Generated Caption")

photo = st.camera_input("Capture a Photo")

if photo is not None:
    image = Image.open(photo)
    st.image(image, caption="Uploaded Image", use_column_width=True)
    
    if st.button("Generate Caption") and image is not None:
        captions = caption(image) 
        caption_of_image = str(captions[0]['generated_text'])
        st.success(caption_of_image)

if caption_of_image is not None:
    state.img_received.append(caption_of_image)

st.write("Caption text:")
for index, caption_text in enumerate(state.img_received):
    st.write(f"{index + 1}. {caption_text}")

if state.img_received:
    st.header("Select Caption")
    selected_text_cap = st.selectbox("Select Caption:", state.img_received)
    state.caption_text = f"{selected_text_cap}"
    state.converting_text += f". Description of environment of the speaker is {state.caption_text}"

st.divider()

# Braille conversion
st.header("Braille Conversion")
st.write("Convert selected text to Braille.")
if st.button("Convert to Braille"):
    state.braille_instructions = word_to_braille(state.converting_text)     
    st.success(f"Braille instructions for {state.converting_text} are: {state.braille_instructions}")

st.divider()

# Send to Github File
st.header("Send to Device")
st.write("Send Translation Instructions to Device")

if st.button("Send", type="primary"):
    instructions_list = state.converting_text

    # Get content
    response = requests.get(api_url, headers={"Authorization": f"Bearer {access_token}"})
    response_data = response.json()

    # Extract content
    current_content = response_data["content"]
    current_content_decoded = current_content.encode("utf-8")
    current_content_decoded = base64.b64decode(current_content_decoded).decode("utf-8")
    
    # Update content
    new_content = instructions_list

    # Encode new content
    new_content_encoded = base64.b64encode(new_content.encode("utf-8")).decode("utf-8")

    # Prepare data
    data = {
        "message": "Update instructions.txt with instructions",
        "content": new_content_encoded,
        "sha": response_data["sha"]
    }

    # Update
    update_response = requests.put(api_url, headers={"Authorization": f"Bearer {access_token}"}, json=data)

    if update_response.status_code == 200:
        st.success("Sent!")
    else:
        st.error(f"Error updating file. Status code: {update_response.status_code}")
