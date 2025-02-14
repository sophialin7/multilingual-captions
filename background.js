chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "extractSubtitles",
        title: "Extract YouTube Subtitles",
        contexts: ["page"],
        documentUrlPatterns: ["https://www.youtube.com/watch*"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extractSubtitles") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractSubtitles
        });
    }
});
