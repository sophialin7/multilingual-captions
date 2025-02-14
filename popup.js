document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("get-subtitles").addEventListener("click", async () => {
        console.log("Extracting subtitles...");
        chrome.runtime.sendMessage({ action: "fetch_subtitles" }, (response) => {
            console.log(response.status);
        });
    });
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.subtitles) {
        document.getElementById("subtitles").innerText = message.subtitles;
    }
});

