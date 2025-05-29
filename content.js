if (!window.__xpathHighlighterInjected) {
    window.__xpathHighlighterInjected = true;
  
    window.__xpathSaved = []; // Store saved entries
  
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === "start") {
        console.log("XPath selection activated");
        document.addEventListener("click", handleClick, true);
      }
    });
  
    function getRelativeXPath(el) {
      if (el.id) return `//*[@id="${el.id}"]`;
      const parts = [];
      while (el && el.nodeType === 1) {
        let index = 1;
        let sibling = el.previousElementSibling;
        while (sibling) {
          if (sibling.nodeName === el.nodeName) index++;
          sibling = sibling.previousElementSibling;
        }
        parts.unshift(`${el.nodeName.toLowerCase()}[${index}]`);
        el = el.parentNode;
      }
      return '//' + parts.join('/');
    }
  
    function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      document.removeEventListener("click", handleClick, true);
  
      const xpath = getRelativeXPath(e.target);
      e.target.style.outline = "2px solid red";
  
      // 🧠 Prompt immediately (synchronously)
      const name = prompt("Enter a name for this element:");
      if (!name) {
        console.log("Element skipped (no name entered)");
        return;
      }
  
      // Save
      const entry = { name, xpath };
      window.__xpathSaved.push(entry);
      console.log("✅ Saved:", entry);
      console.table(window.__xpathSaved);
    }
  }
  