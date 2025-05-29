let selectedXPaths = [];
let extensionActive = true;

const xpathList = document.getElementById("xpathList");
const toggleBtn = document.getElementById("toggle");
const clearAllBtn = document.getElementById("clearAll");

function renderList() {
  xpathList.innerHTML = "";
  selectedXPaths.forEach(({ name, xpath }, i) => {
    const li = document.createElement("li");
    li.textContent = `${name} : ${xpath}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      selectedXPaths.splice(i, 1);
      saveAndUpdate();
    };

    li.appendChild(delBtn);
    xpathList.appendChild(li);
  });
}

async function saveAndUpdate() {
  // Save in chrome.storage (optional for persistence)
  await chrome.storage.local.set({ savedXPaths: selectedXPaths });

  // Send updated list to content script to highlight
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "setElements", data: selectedXPaths }).catch(console.warn);

  renderList();
}

async function loadSaved() {
  const result = await chrome.storage.local.get("savedXPaths");
  selectedXPaths = result.savedXPaths || [];
  renderList();

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "setElements", data: selectedXPaths }).catch(console.warn);
}

toggleBtn.onclick = async () => {
  extensionActive = !extensionActive;
  toggleBtn.textContent = extensionActive ? "Disable Extension" : "Enable Extension";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "toggle" }).catch(console.warn);
};

clearAllBtn.onclick = async () => {
  if (!confirm("Delete all saved XPaths?")) return;
  selectedXPaths = [];
  await chrome.storage.local.remove("savedXPaths");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "clearAll" }).catch(console.warn);
  renderList();
};

// Load saved xpaths on panel Open
loadSaved();

document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("saveButton");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        const name = document.getElementById("nameInput").value;
  
        if (!name) {
          alert("Please enter a name for the XPath.");
          return;
        }
  
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
        chrome.tabs.sendMessage(tab.id, {
          action: "saveXPath",
          name
        }).catch(err => {
          console.error("Message send error:", err);
          alert("Could not communicate with the content script.");
        });
      });
    } else {
      console.error("Save button not found in the DOM.");
    }
  });
  