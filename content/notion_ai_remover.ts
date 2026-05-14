// const placeholderText = "Press ‘space’ for AI or ‘/’ for commands";

function addCSS(css: string) {
  document.head.appendChild(document.createElement("style")).innerHTML = css;
}

function alterPlaceHolderText() {
  addCSS(
    `div.notranslate:empty[placeholder*="Press"][placeholder*="AI"]::after { content:"Write something, or press ' / ' for commands…" !important; }`,
  );
}

function repeatObserver(
  callbackFns: Array<
    (
      mutations: MutationRecord[],
      observer: MutationObserver,
      node: HTMLElement,
    ) => void
  >,
  node: HTMLElement,
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

  return {
    cleanup: () => {
      if (observer != undefined) {
        observer.disconnect();
      }
    },
  };
}

function singleTimeObserver(
  callbackFn: (
    mutations: MutationRecord[],
    observer: MutationObserver,
    node: HTMLElement,
  ) => boolean,
  node: HTMLElement,
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
  notionAppNode: HTMLElement,
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

function removeAiSidebarHome(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  let deleted = false;

  const homeAiMeetingNotes = notionAppNode.querySelectorAll(
    "#sidebar-tabpanel-home > div > div > div > div > div > div > div > div > div > div",
  );
  for (const aiMenu of homeAiMeetingNotes) {
    const textMatches = ["ai meeting"];
    for (const textMatch of textMatches) {
      if (aiMenu.innerHTML?.toLowerCase().includes(textMatch)) {
        (aiMenu as HTMLElement).style.display = "none";
        deleted = true;
      }
    }
  }

  const agentTitles = notionAppNode.querySelectorAll(
    "#sidebar-tabpanel-home > div > div > div > div > div > div > div > div > span",
  );
  for (const agent of agentTitles) {
    const textMatches = ["agents"];
    for (const textMatch of textMatches) {
      if (agent.innerHTML?.toLowerCase().includes(textMatch)) {
        (
          agent.parentElement?.parentElement?.parentElement as HTMLElement
        ).style.display = "none";
        deleted = true;
      }
    }
  }

  const agents = notionAppNode.querySelectorAll(
    "#sidebar-tabpanel-home > div > div > div > div > div > div > div > div > div",
  );
  for (const agent of agents) {
    const textMatches = ["agents"];
    for (const textMatch of textMatches) {
      if (agent.innerHTML?.toLowerCase().includes(textMatch)) {
        (
          agent.parentElement?.parentElement?.parentElement as HTMLElement
        ).style.display = "none";
        deleted = true;
      }
    }
  }

  const notionAiMenu = notionAppNode.querySelector(`a[href="/ai"]`);
  if (notionAiMenu != null) {
    (notionAiMenu as HTMLElement).style.display = "none";
    deleted = true;
  }

  const newChats = notionAppNode.querySelectorAll(
    ".notion-sidebar > div > div span",
  );
  for (let i = newChats.length - 1; i >= 0; i--) {
    const newChat = newChats[i];
    const textMatches = ["new chat"];
    for (const textMatch of textMatches) {
      if (newChat.textContent?.toLowerCase().startsWith(textMatch)) {
        newChat.parentElement!.parentElement!.parentElement!.parentElement!.parentElement!.remove();
        deleted = true;
      }
    }
  }

  const chats = notionAppNode.querySelector(
    "#sidebar-tab-chats",
  ) as HTMLElement;
  if (chats) {
    chats.style.display = "none";
  }

  return deleted;
}

function removeAiSidebarMeeting() {
  let deleted = true;
  const meetingsAiNotes = document.querySelectorAll(
    "#sidebar-tabpanel-meetings > div > div > div > div > div > div > div",
  );
  for (const aiMenu of meetingsAiNotes) {
    const textMatches = ["ai meeting"];
    for (const textMatch of textMatches) {
      if (aiMenu.innerHTML?.toLowerCase().includes(textMatch)) {
        (aiMenu as HTMLElement).style.display = "none";
        deleted = true;
      }
    }
  }
  return deleted;
}

function removeRunOutOfResponse(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
): boolean {
  const runOutOfResponse = notionAppNode.querySelector(
    ".notion-sidebar .xmark",
  );
  if (runOutOfResponse != null) {
    (
      runOutOfResponse.parentElement?.parentElement?.parentElement
        ?.parentElement?.parentElement?.parentElement as HTMLElement
    ).style.display = "none";
    return true;
  }
  return false;
}

function removeBuildWithAi(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const aiFace = notionAppNode.querySelector("div.notion-dialog svg.aiFace");
  aiFace?.parentElement?.parentElement?.remove();
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
  notionAppNode: HTMLElement,
) {
  // ai explain button
  removeParent(notionAppNode, ".notion-text-action-menu .aiExplainThis");
  removeParent(
    notionAppNode,
    ".notion-text-action-menu svg.questionMarkCircle",
  );
  // ai face
  removeParent(
    notionAppNode,
    `.notion-text-action-menu div[role="button"] img[alt="Notion AI Face"]`,
  );
  // ai improve writing button
  removeParent(notionAppNode, ".notion-text-action-menu .aiImproveWriting");
  removeParent(notionAppNode, ".notion-text-action-menu svg.magicWand");

  const aiMenus = notionAppNode.querySelectorAll(
    ".notion-text-action-menu > div > div > div",
  );
  for (const aiMenu of aiMenus) {
    const textMatches = ["improve", "edit with ai"];
    for (const textMatch of textMatches) {
      if (aiMenu.innerHTML?.toLowerCase().includes(textMatch)) {
        (aiMenu as HTMLElement).style.display = "none";
      }
    }
  }
}

function removeFromGetStarted(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const askAiImage = notionAppNode.querySelector(
    `div[role="menu"] img[alt="Notion AI Face"]`,
  );
  if (askAiImage != null) {
    const askAiButton = askAiImage?.parentElement?.parentElement
      ?.parentElement as HTMLElement;
    const getStartedMenu = askAiButton?.parentElement as HTMLElement;
    askAiButton.remove()
    for(const child of getStartedMenu.children){
      if(child.tagName!="div" && child.textContent?.toLowerCase().includes("ai meeting")){
        child.remove();
      }
    }
  }
}

function removeFromImage(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const askAiImageButtons = notionAppNode.querySelectorAll(
    `div[aria-label="Ask AI"]`,
  );
  askAiImageButtons.forEach((ele) => {
    ele.remove();
  });

  const askAiImageMenu = notionAppNode.querySelector(
    `div[role="menuitem"] svg.face`,
  );
  if (askAiImageMenu != null) {
    (
      askAiImageMenu?.parentElement?.parentElement?.parentElement
        ?.parentElement as HTMLElement
    ).style.display = "none";
  }
}
function removeFromSettings(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const aiSettings = notionAppNode.querySelector(
    ".notion-space-settings #settings-tab-ai",
  );
  if (aiSettings != null) {
    (aiSettings as HTMLElement).style.display = "none";
  }
}

function removeFromLibrary(){
  const tabs = document.querySelectorAll(".notion-collection-view-tab")
  for(const tab of tabs){
    if(tab.textContent?.toLowerCase().includes("ai meeting")){
      tab.remove()
    }
  }
}

function removeFromPageMenu(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const aiMenus = notionAppNode.querySelectorAll(
    ".notion-overlay-container div[role='dialog'] div[role='presentation']",
  );
  for (const aiMenu of aiMenus) {
    const textMatches = ["with ai","ai auto"];
    for (const textMatch of textMatches) {
      if (aiMenu.innerHTML?.toLowerCase().includes(textMatch)) {
        (aiMenu as HTMLElement).parentElement!.parentElement!.parentElement!.style.display = "none";
      }
    }
  }
}

function removeSearchMatch(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionLayoutContentNode: HTMLElement,
): boolean {
  const foundNodes = notionLayoutContentNode.querySelectorAll(
    ".search-results-list > div > div > div[role='option'], .search-2-snapshot-container > div > div > div[role='option']",
  );
  for (const found of foundNodes) {
    if (
      found.textContent &&
      (found.textContent.toLowerCase().includes("notion ai") ||
        found.textContent.toLowerCase().includes("ai meeting"))
    ) {
      // Hide instead of delete to prevent crash
      (found as HTMLElement).style.display = "none";
      return true;
    }
  }
  return false;
}

function removeAiSearch(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionLayoutContentNode: HTMLElement,
): boolean {
  const found = notionLayoutContentNode.querySelector(
    ".notion-dialog div[role='presentation']",
  );
  if (
    !found ||
    !(
      found.textContent?.toLowerCase().includes("search") ||
      found.textContent?.toLowerCase().includes("with ai")
    )
  ) {
    return false;
  }
  // Hide instead of delete to prevent crash
  (
    found.parentElement?.parentElement?.parentElement as HTMLElement
  ).style.display = "none";
  return true;
}

function removeGettingStartAskAi(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const icons = notionAppNode.querySelectorAll(
    'content-editable-void-no-select img[alt="Notion AI Face"]',
  );
  icons.forEach((icon) => {
    const askAi = icon?.parentElement?.parentElement;
    if (askAi) {
      askAi.remove();
    }
  });
}

function removeGettingStartAiMeeting(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const aiMeetingCandis = notionAppNode.querySelectorAll(
    ".content-editable-void-no-select > div > div > div > div > div > div",
  );

  for (const aiMeetingCandi of aiMeetingCandis) {
    if (
      aiMeetingCandi.textContent &&
      aiMeetingCandi.textContent.toLowerCase().includes("ai meeting")
    ) {
      // Hide instead of delete to prevent crash
      (aiMeetingCandi as HTMLElement).style.display = "none";
      return true;
    }
  }
  return false;
}

function onGettingStart(
  gettingStartCtx: { cleanup: (() => void) | undefined },
  notionAppNode: HTMLElement,
) {
  if (window.location.href.match(/www.notion.so\/[a-z0-9]+$/)) {
    const { cleanup } = repeatObserver(
      [removeGettingStartAiMeeting, removeGettingStartAskAi],
      notionAppNode,
    );
    if (gettingStartCtx.cleanup != undefined) {
      gettingStartCtx.cleanup();
    } else {
      gettingStartCtx.cleanup = cleanup;
    }
  } else {
    if (gettingStartCtx.cleanup != undefined) {
      gettingStartCtx.cleanup();
    }
  }
}

function onLibrary(
  libraryCtx: { cleanup: (() => void) | undefined },
  notionAppNode: HTMLElement,){
  if (window.location.href.match(/www.notion.so\/library/)) {
    const { cleanup } = repeatObserver(
      [removeFromLibrary],
      notionAppNode,
    );
    if (libraryCtx.cleanup != undefined) {
      libraryCtx.cleanup();
    } else {
      libraryCtx.cleanup = cleanup;
    }
  } else {
    if (libraryCtx.cleanup != undefined) {
      libraryCtx.cleanup();
    }
  }
}

function removeAiOverlay(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  const aiMeetingMenus = notionAppNode.querySelectorAll(
    ".notion-overlay-container div[role='menuitem'] div[role='presentation']",
  );
  for (const aiMenu of aiMeetingMenus) {
    const textMatches = ["ai meeting"];
    for (const textMatch of textMatches) {
      if (
        aiMenu.innerHTML?.toLowerCase().startsWith(textMatch) &&
        aiMenu?.parentElement
      ) {
        let parent: HTMLElement | undefined =
          aiMenu.parentElement as HTMLElement;
        while (parent.role != "menuitem") {
          parent = parent?.parentElement as HTMLElement;
        }
        parent?.remove();
        return true;
      }
    }
  }
  return false;
}

function removeMeetAiNotes(
  _mutations: MutationRecord[],
  _observer: MutationObserver,
  notionAppNode: HTMLElement,
) {
  notionAppNode
    .querySelectorAll("main.notion-frame div > span")
    .forEach((ele) => {
      if (
        ele == undefined ||
        ele.textContent == undefined ||
        !ele.textContent.toLowerCase().includes("ai meeting")
      ) {
        return;
      }
      let parent = ele;
      while ((parent as HTMLElement)?.style?.display != "contents") {
        parent = parent.parentElement as HTMLElement;
      }
      parent.remove();
    });
}

function onMeet(
  meetCtx: { cleanup: (() => void) | undefined },
  notionAppNode: HTMLElement,
) {
  if (window.location.href.match(/www.notion.so\/meet/)) {
    removeMeetAiNotes([], null as unknown as MutationObserver, notionAppNode);
    const { cleanup } = repeatObserver([removeMeetAiNotes], notionAppNode);
    if (meetCtx.cleanup != undefined) {
      meetCtx.cleanup();
    } else {
      meetCtx.cleanup = cleanup;
    }
  } else {
    if (meetCtx.cleanup != undefined) {
      meetCtx.cleanup();
    }
  }
}

function main() {
  alterPlaceHolderText();

  const notionAppNode = document.getElementById("notion-app");

  if (notionAppNode == null) {
    throw new Error("Error cannot find Notion App Node (#notion-app)");
  }

  singleTimeObserver(removeRunOutOfResponse, notionAppNode);

  const gettingStartCtx: { cleanup: (() => void) | undefined } = {
    cleanup: undefined,
  };
  const meetCtx: { cleanup: (() => void) | undefined } = {
    cleanup: undefined,
  };
  const libraryCtx: { cleanup: (() => void) | undefined } = {
    cleanup: undefined,
  };

  function onPopAndInit(){
    if(notionAppNode==null){
      return
    }
    onGettingStart(gettingStartCtx, notionAppNode);
    onMeet(meetCtx, notionAppNode);
    onLibrary(libraryCtx,notionAppNode)
  }

  onPopAndInit()

  window.addEventListener("popstate", onPopAndInit);

  repeatObserver(
    [
      removeAiSidebarHome,
      removeAiSidebarMeeting,
      removeFromActionMenu,
      removeFromGetStarted,
      removeFromImage,
      removeAIButton,
      removeBuildWithAi,
      removeAiSearch,
      removeFromSettings,
      removeSearchMatch,
      removeFromPageMenu,
      removeAiOverlay,
    ],
    notionAppNode,
  );

  addSpaceKeyMiddleware();
}

console.log("initializing No Notion AI");
main();
