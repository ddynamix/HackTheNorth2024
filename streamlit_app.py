#Import Libraries
import streamlit as st
from streamlit_mic_recorder import mic_recorder, speech_to_text
import requests
import base64
from gtts import gTTS

#Repo Details
repo_owner = "jotigokaraju"
repo_name = sensescript
file_path = "instructions.txt"

# GitHub API URL
api_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path_instructions}"
api_url_commands = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path_reciever}"

#HIDE
access_token = REDACTED

state = st.session_state
    
if 'text_received' not in state:
    state.text_received = []

state.selected_text = None

st.title(":red[SenseScript]")
st.header("Helping Make The World Accessible for the Deafblind")
st.divider()

# Recorder and Transcriber
st.header("Speech-to-Text Converter")
st.write("Record and transcribe your speech.")

# Speech-to-text recorder
text = speech_to_text(language='en', start_prompt="Start 🔴", stop_prompt="Stop 🟥", use_container_width=True, just_once=True, key='STT')

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

st.divider()
# Braille conversion
st.header("Braille Conversion")
st.write("Convert selected text to Braille.")

if st.button("Convert to Braille "):
    state.braille_instructions = word_to_braille(state.text_received)     
    st.success(f"Braille instructions for {state.text_received} are: {state.braille_instructions}")

st.divider()

# Send to Github File
st.header("Send to Device")
st.write("Send Translation Instructions to Device")

if st.button("Send ", type="primary"):
    instructions_list = state.text_received

    # Get content
    response = requests.get(api_url, headers={"Authorization": f"Bearer {access_token}"})
    response_data = response.json()

    # Extract content
    current_content = response_data["content"]
    current_content_decoded = current_content.encode("utf-8")
    current_content_decoded = base64.b64decode(current_content_decoded).decode("utf-8")
    
    # Update content
    new_content = f"{instructions_list}"

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
