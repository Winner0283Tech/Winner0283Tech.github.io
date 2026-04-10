let editor;
let files = JSON.parse(localStorage.getItem("files")) || {
  "main.js": "console.log('Hello VS Code Clone');"
};

let currentFile = "main.js";

/* Monaco Init */
require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" }
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

/* FILE SYSTEM */
function renderFiles() {
  const list = document.getElementById("fileList");
  list.innerHTML = "";

  Object.keys(files).forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
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

/* RUN */
function runCode() {
  const code = editor.getValue();
  const frame = document.getElementById("output");

  frame.srcdoc = code;
}

/* LANGUAGE */
document.addEventListener("change", (e) => {
  if (e.target.id === "language") {
    monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
  }
});

/* =========================
   🤖 AI (SAFE VERSION)
   ========================= */

async function askAI() {
  const prompt = document.getElementById("prompt").value;
  const code = editor.getValue();

  const resBox = document.getElementById("aiResult");

  resBox.textContent = "Thinking...";

  // ❗ WICHTIG:
  // KEIN API KEY im Frontend!
  // Stattdessen Backend / Serverless Function nutzen.

  try {
    const response = await fetch("https://winner0283tech-github-io.vercel.app/api/ai.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, code })
    });

    const data = await response.json();
    resBox.textContent = data.result;

  } catch (e) {
    resBox.textContent =
      "AI nicht verbunden. Du brauchst Backend (API Proxy).";
  }
}
