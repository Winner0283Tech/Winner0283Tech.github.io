let editor;

const API_URL = "https://winner0283tech-github-eujjadftv-winner0283techs-projects.vercel.app/api/ai";
// 🔥 WICHTIG: Das ist deine echte Vercel API URL

let files = JSON.parse(localStorage.getItem("files")) || {
  "main.js": "console.log('Hello World');"
};

let currentFile = "main.js";

/* =========================
   MONACO EDITOR INIT
========================= */
require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs"
  }
});

require(["vs/editor/editor.main"], function () {

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: files[currentFile],
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true
  });

  renderFiles();
});

/* =========================
   FILE SYSTEM
========================= */

function renderFiles() {
  const list = document.getElementById("fileList");
  list.innerHTML = "";

  Object.keys(files).forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.style.cursor = "pointer";

    div.onclick = () => openFile(name);
    list.appendChild(div);
  });
}

function newFile() {
  const name = prompt("File name?");
  if (!name) return;

  files[name] = "";
  saveToStorage();
  renderFiles();
}

function openFile(name) {
  currentFile = name;
  editor.setValue(files[name]);
}

function saveFile() {
  files[currentFile] = editor.getValue();
  saveToStorage();
  alert("Saved!");
}

function saveToStorage() {
  localStorage.setItem("files", JSON.stringify(files));
}

/* =========================
   RUN CODE (HTML PREVIEW)
========================= */

function runCode() {
  const code = editor.getValue();
  const frame = document.getElementById("output");

  frame.srcdoc = code;
}

/* =========================
   LANGUAGE SWITCH
========================= */

document.addEventListener("change", (e) => {
  if (e.target.id === "language") {
    monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
  }
});

/* =========================
   🤖 AI ASSISTANT (FIXED)
========================= */

async function askAI() {
  const prompt = document.getElementById("prompt").value;
  const code = editor.getValue();
  const resBox = document.getElementById("aiResult");

  console.log("Using API:", API_URL);

  resBox.textContent = "Connecting to AI... 🤖";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        code
      })
    });

    if (!response.ok) {
      throw new Error("HTTP Error: " + response.status);
    }

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    resBox.textContent = data.result || "No response from AI";

  } catch (err) {
    console.error("AI ERROR:", err);

    resBox.textContent =
      "❌ API not connected. Check Vercel deployment or URL.";
  }
}
