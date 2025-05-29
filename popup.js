document.getElementById("start").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  
    chrome.tabs.sendMessage(tab.id, { action: "start" }).catch((err) => {
        console.warn("Could not send message:", err.message);
      });
    window.close(); // optional: close the popup
  });
  