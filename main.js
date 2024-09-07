import { GoogleGenerativeAI } from "@google/generative-ai";

const button = document.querySelector(".send");
const input = document.querySelector(".input");
const output = document.querySelector(".ai-message");
const message_area = document.querySelector(".message_area");
const loader = document.querySelector(".loading");
const startRecordingButton = document.querySelector(".start-recording");
const stopRecordingButton = document.querySelector(".stop-recording");

const genAi = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

let recognition = null;
let isRecording = false;

const initializeSpeechRecognition = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support Speech Recognition.');
    return;
  }
  
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'th-TH'; // Set the language to Thai

  recognition.onstart = () => {
    isRecording = true;
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'inline-block';
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    input.value = transcript;
  };

  recognition.onerror = (event) => {
    console.error('Speech Recognition Error', event.error);
  };

  recognition.onend = () => {
    isRecording = false;
    startRecordingButton.style.display = 'inline-block';
    stopRecordingButton.style.display = 'none';
  };
};

const startRecording = () => {
  if (recognition) {
    recognition.start();
  }
};

const stopRecording = () => {
  if (recognition) {
    recognition.stop();
  }
};

// Initialize Speech Recognition
initializeSpeechRecognition();

startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);

button.addEventListener("click", async () => {
  if (!input.value) return alert("Pls enter a message");
  var prompt = input.value;
  message_area.innerHTML += `<div class="message user-message">
  <div class="img"><img class="user" src="/my_face-removebg-preview.png" alt=""></div>
  <div class="text">${prompt}</div>
  </div>`;
  loader.style.visibility = "visible";
  message_area.scrollTop = message_area.scrollHeight;

  const model = genAi.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts:
          "Who is your owner/creator?, Do you know?, You are created by SBW., ใครสร้างเธอ",
      },
      {
        role: "model",
        parts:
          "The name of this chatbot is Gemini. It is created by SBW.",
      },
    ],
    generationConfig: {
      maxOutputTokens: 100000000,
    },
  });
  try {
    const result = await chat.sendMessageStream(prompt);
    input.value = "";
    const response = await result.response;
    var text = await response.text();
  } catch (error) {
    loader.style.visibility = "hidden";
    prompt = "";
    input.value = "";
    message_area.scrollTop = message_area.scrollHeight - message_area.clientHeight;
    return message_area.innerHTML += `<div class="message ai-message">
  <div class="img"><img src="/logo.png" alt=""></div>
  <div class="text">${error.message}</div>
</div>`;
  }
  
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    const formattedTextWithItalic = formattedText.replace(
      /\*(.*?)\*/g,
      "<i>$1</i>"
    );

    const formattedTextWithLinks = formattedTextWithItalic.replace(
      /(https?:\/\/[^\s]+)/g,
      (match) => {
        if (match === "") {
          return '<a href="" style="color: blue;" target=_blank></a>';
        } else {
          return '<a href="' + match + '" style="color: blue;" target=_blank>' + match + '</a>';
        }
      }
    );
    loader.style.visibility = "hidden";
    message_area.innerHTML += `<div class="message ai-message">
    <div class="img"><img src="/logo.png" alt=""></div>
    <div class="text">${formattedTextWithLinks}</div>
  </div>`;
    message_area.scrollTop = message_area.scrollHeight - message_area.clientHeight;
  });
