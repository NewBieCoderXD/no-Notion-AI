// const placeholderText = "Write, press 'space' for AI, ' / ' for commands…";

function addCSS(css: string) {
  document.head.appendChild(document.createElement("style")).innerHTML = css;
}

function alterPlaceHolderText() {
  addCSS(
    `div.notranslate:empty[placeholder*="Write"][placeholder*="AI"]::after { content:"Write something, or press ' / ' for commands…" !important; }`
  );
}

function repeatObserver(
  callbackFns: Array<
    (
      mutations: MutationRecord[],
      observer: MutationObserver,
      node: HTMLElement
    ) => void
  >,
  node: HTMLElement
) {
  const observer = new MutationObserver(function (mutations, observer) {
    callbackFns.forEach((callbackFn) => {
      callbackFn(mutations, observer, node);
    });
  });

  observer.observe(node, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });
}

function singleTimeObserver(
  callbackFn: (
    mutations: MutationRecord[],
    observer: MutationObserver,
    node: HTMLElement
  ) => boolean,
  node: HTMLElement
) {
  const observer = new MutationObserver(function (mutations, observer) {
    if (callbackFn(mutations, observer, node)) {
      observer.disconnect();
    }
  });

  observer.observe(node, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });
}

function removeAIButton(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement
): boolean {
  const elements = notionAppNode.querySelectorAll(".notion-ai-button");
  if (elements.length != 0) {
    elements.forEach((button) => {
      button.remove();
    });
    return true;
  }
  return false;
}

function removeRunOutOfResponse(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement
): boolean {
  const runOutOfResponse = notionAppNode.querySelector(
    ".notion-sidebar .xmark"
  );
  if (runOutOfResponse != null) {
    runOutOfResponse.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.remove();
    return true;
  }
  return false;
}

function removeAiMenuSidebar(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement
): boolean {
  const notionAiMenu = notionAppNode.querySelector(`a[href="/chat"]`);
  if (notionAiMenu != null) {
    notionAiMenu?.remove();
    return true;
  }
  return false;
}

function removeAiScroller(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement
) {
  const aiFace = notionAppNode.querySelector(".notion-scroller svg.aiFace");
  aiFace?.parentElement?.parentElement?.parentElement?.parentElement?.remove();
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

function removeParent(root: HTMLElement, query: string) {
  root.querySelector(query)?.parentElement?.remove();
}

function removeFromActionMenu(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement
) {
  // ai explain button
  removeParent(notionAppNode, ".notion-text-action-menu .aiExplainThis");
  removeParent(
    notionAppNode,
    ".notion-text-action-menu svg.questionMarkCircle"
  );
  // ai face
  removeParent(
    notionAppNode,
    `.notion-text-action-menu div[role="button"] img[alt="Notion AI Face"]`
  );
  // ai improve writing button
  removeParent(notionAppNode, ".notion-text-action-menu .aiImproveWriting");
  removeParent(notionAppNode, ".notion-text-action-menu svg.magicWand");
}

function removeFromImage(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement
) {
  const askAiImageButtons = notionAppNode.querySelectorAll(
    `div[aria-label="Ask AI"]`
  );
  askAiImageButtons.forEach((ele) => {
    ele.remove();
  });

  const askAiImageMenu = notionAppNode.querySelector(
    `div[role="menuitem"] svg.face`
  );
  if (askAiImageMenu != null) {
    askAiImageMenu?.parentElement?.parentElement?.parentElement?.parentElement?.remove();
  }
}

function main() {
  alterPlaceHolderText();

  const notionAppNode = document.getElementById("notion-app");

  if (notionAppNode == null) {
    throw new Error("Error cannot find Notion App Node (#notion-app)");
  }

  singleTimeObserver(removeAIButton, notionAppNode);

  singleTimeObserver(removeRunOutOfResponse, notionAppNode);

  singleTimeObserver(removeAiMenuSidebar, notionAppNode);

  repeatObserver(
    [removeFromActionMenu, removeFromImage, removeAiScroller],
    notionAppNode
  );

  addSpaceKeyMiddleware();
}

console.log("initializing No Notion AI");
main();
