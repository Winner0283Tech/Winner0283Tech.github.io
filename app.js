let editor;

const API_URL =
  "https://winner0283tech-github-eujjadftv-winner0283techs-projects.vercel.app/api/ai";
// 👉 :contentReference[oaicite:0]{index=0} Backend URL

let files = JSON.parse(localStorage.getItem("files")) || {
  "main.js": "console.log('Hello World');"
};

let currentFile = "main.js";

/* =========================
   MONACO EDITOR
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
  if (!list) return;

  list.innerHTML = "";

  Object.keys(files).forEach((name) => {
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
  if (editor) editor.setValue(files[name]);
}

function saveFile() {
  if (!editor) return;

  files[currentFile] = editor.getValue();
  saveToStorage();
  alert("Saved!");
}

function saveToStorage() {
  localStorage.setItem("files", JSON.stringify(files));
}

/* =========================
   RUN CODE
========================= */

function runCode() {
  const code = editor.getValue();
  const frame = document.getElementById("output");

  if (!frame) return;

  frame.srcdoc = code;
}

/* =========================
   LANGUAGE SWITCH
========================= */

document.addEventListener("change", (e) => {
  if (e.target && e.target.id === "language") {
    monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
  }
});

/* =========================
   🤖 AI CHAT (FIXED + SAFE)
========================= */

async function askAI() {
  const promptEl = document.getElementById("prompt");
  const resBox = document.getElementById("aiResult");

  if (!resBox) return;

  const prompt = promptEl ? promptEl.value : "";
  const code = editor ? editor.getValue() : "";

  console.log("🚀 Sending request to AI...");
  console.log("API:", API_URL);

  resBox.textContent = "Connecting AI... 🤖";

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

    console.log("Status:", response.status);

    const raw = await response.text();
    console.log("RAW RESPONSE:", raw);

    let data;

    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("Invalid JSON from server");
    }

    if (!response.ok) {
      throw new Error(data.error || "API Error");
    }

    resBox.textContent = data.result || "No response";

  } catch (err) {
    console.error("❌ AI ERROR:", err);
    resBox.textContent = "❌ AI not connected (check console)";
  }
}
