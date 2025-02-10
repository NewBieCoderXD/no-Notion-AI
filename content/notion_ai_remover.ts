// const placeholderText = "Write, press 'space' for AI, ' / ' for commands…";

function addCSS(css: string) {
  document.head.appendChild(document.createElement("style")).innerHTML = css;
}

function alterPlaceHolderText() {
  addCSS(
    `div.notranslate:empty[placeholder*="Write"][placeholder*="AI"]::after { content:"Write something, or press ' / ' for commands…" !important; }`
  );
}

function removeAIButton(notionAppNode: HTMLElement) {
  const aiButtonObserver = new MutationObserver(function (
    _mutations,
    observer
  ) {
    const elements = notionAppNode.querySelectorAll(".notion-ai-button");
    if (elements.length != 0) {
      elements.forEach((button) => {
        button.remove();
        observer.disconnect();
      });
    }
  });

  aiButtonObserver.observe(notionAppNode, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });
}

function removeAISidebar(notionAppNode: HTMLElement) {
  const aiSidebarObserver = new MutationObserver(function (
    _mutations,
    observer
  ) {
    const notionAIElements = notionAppNode.querySelectorAll(
      ".notion-sidebar > div:nth-child(4) > div:nth-child(5)"
    );
    if (notionAIElements.length != 0) {
      notionAIElements.forEach((ele) => {
        ele.remove();
        observer.disconnect();
      });
    }
  });

  aiSidebarObserver.observe(notionAppNode, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });
}

function addSpaceKeyMiddleware() {
  document.addEventListener("keydown", (keyEvent) => {
    if (keyEvent.key == " ") {
      const rawAnchorNode = document.getSelection()?.anchorNode;
      let anchorNode: HTMLElement;
      if (rawAnchorNode?.nodeType == Node.TEXT_NODE) {
        anchorNode = rawAnchorNode.parentElement!;
      } else {
        anchorNode = <HTMLElement>rawAnchorNode!;
      }

      if (anchorNode.innerHTML != "") {
        return;
      }

      anchorNode.innerText += " ";

      const range = document.createRange();
      range.selectNodeContents(anchorNode);
      range.collapse(false);
      keyEvent.preventDefault();

      const selection = window.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);

      keyEvent.preventDefault();
    }
  });
}

function removeFromActionMenu(notionAppNode: HTMLElement) {
  const aiExplainThisObserver = new MutationObserver(() => {
    const explainButton = notionAppNode.querySelector(
      ".notion-text-action-menu .aiExplainThis"
    );
    explainButton?.parentElement?.remove();

    const askAIButton = notionAppNode.querySelector(
      `.notion-text-action-menu div[role="button"] img[alt="Notion AI Face"]`
    );
    askAIButton?.parentElement?.remove();
  });

  aiExplainThisObserver.observe(notionAppNode, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });
}

function removeNotionAI() {
  alterPlaceHolderText();

  const notionAppNode = document.getElementById("notion-app");

  if (notionAppNode == null) {
    throw new Error("Error cannot find Notion App Node (#notion-app)");
  }

  removeAIButton(notionAppNode);

  removeAISidebar(notionAppNode);

  removeFromActionMenu(notionAppNode);

  addSpaceKeyMiddleware();
}

console.log("initializing No Notion AI");
removeNotionAI();
