async function fetchSubtitles() {
    const videoId = new URL(window.location.href).searchParams.get("v");
    if (!videoId) return alert("No video ID found!");

    const langCode = "en";
    const subtitleUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${langCode}`;

    try {
        const response = await fetch(subtitleUrl);
        if (!response.ok) throw new Error("No subtitles available!");

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        const subtitles = [...xmlDoc.getElementsByTagName("text")].map(node => node.textContent).join("\n");

        // Create and download a .txt file
        const blob = new Blob([subtitles], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "subtitles.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Error fetching subtitles:", error);
        alert("No subtitles found.");
    }
}

getSubtitles();


// Run script when the page loads
fetchSubtitles();
