function addCSS(css: string) {
  document.head.appendChild(document.createElement("style")).innerHTML = css;
}

const placeholderText =
  "Write something, or press 'space' for AI, ' / ' for commands…";

function removeNotionAI() {
  addCSS(
    `div.notranslate[placeholder="${placeholderText}"]:empty::after { content:"Write something, or press ' / ' for commands…" !important; }`
  );

  const notionAppNode = document.getElementById("notion-app");

  if (notionAppNode == undefined) {
    throw new Error("notion-app not found");
  }

  let aiButtonObserver = new MutationObserver(function (mutations) {
    let elements = document.querySelectorAll(".notion-ai-button");
    if (elements.length != 0) {
      elements.forEach((button) => {
        button.remove();
        aiButtonObserver.disconnect();
      });
    }
  });

  aiButtonObserver.observe(notionAppNode, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });

  let aiSidebarObserver = new MutationObserver(function (mutations) {
    let notionAIElements = document.querySelectorAll(
      ".notion-sidebar > div:nth-child(4) > div:nth-child(5)"
    );
    if (notionAIElements.length != 0) {
      notionAIElements.forEach((ele) => {
        ele.remove();
        aiSidebarObserver.disconnect();
      });
    }
  });

  aiSidebarObserver.observe(notionAppNode, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });

  document.addEventListener("keydown", (clickEvent) => {
    if (clickEvent.key == " ") {
      let placeholderElement = <HTMLInputElement>(
        document.querySelector(`.notranslate[placeholder="${placeholderText}"]`)
      );
      if (
        placeholderElement != undefined &&
        placeholderElement.innerHTML == ""
      ) {
        placeholderElement.innerHTML = "&nbsp;";
        const length = placeholderElement.innerHTML.length;
        placeholderElement.setSelectionRange(length, length);
        clickEvent.preventDefault();
      }
    }
  });
}

console.log("initializing No Notion AI");
removeNotionAI();