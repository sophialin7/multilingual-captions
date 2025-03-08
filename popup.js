const API_KEY = "AIzaSyCRl5Yh4mabGYU56dKR7YP9OTUnC-nItlY"; // Replace with your YouTube API key

document.getElementById("fetchData").addEventListener("click", async function () {
    let url = document.getElementById("videoUrl").value;
    let videoId = getYouTubeVideoID(url);

    if (!videoId) {
        alert("Invalid YouTube URL!");
        return;
    }

    // Fetch video metadata
    let metadata = await fetchMetadata(videoId);
    let captions = await fetchCaptions(videoId);

    // Update UI with metadata
    document.getElementById("title").textContent = metadata.title || "N/A";
    document.getElementById("views").textContent = metadata.views || "N/A";
    document.getElementById("duration").textContent = metadata.duration || "N/A";
    document.getElementById("captions").innerHTML = captions || "No captions available";
});


// Extract the video ID from the YouTube URL
function getYouTubeVideoID(url) {
    let match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

// Fetch video metadata from YouTube API
async function fetchMetadata(videoId) {
    let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.items.length === 0) return {};

    let video = data.items[0];
    return {
        title: video.snippet.title,
        views: video.statistics.viewCount,
        duration: parseDuration(video.contentDetails.duration)
    };
}

// Fetch captions data from YouTube API
async function fetchCaptions(videoId) {
    let url = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${API_KEY}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.items.length === 0) return "No captions available";

    // Extract detailed caption snippet information
    let captionDetails = data.items.map(item => {
        const snippet = item.snippet;
        return `
            Video ID: ${snippet.videoId}<br>
            Last Updated: ${snippet.lastUpdated}<br>
            Track Kind: ${snippet.trackKind}<br>
            Language: ${snippet.language}<br>
            Name: ${snippet.name || "N/A"}<br>
            Audio Track Type: ${snippet.audioTrackType}<br>
            Is CC: ${snippet.isCC}<br>
            Is Large: ${snippet.isLarge}<br>
            Is Easy Reader: ${snippet.isEasyReader}<br>
            Is Draft: ${snippet.isDraft}<br>
            Is Auto Synced: ${snippet.isAutoSynced}<br>
            Status: ${snippet.status}
        `;
    }).join("<br><br>");

    return captionDetails;
}


// Convert ISO 8601 duration to a readable format
function parseDuration(duration) {
    let matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = matches[1] ? matches[1].replace("H", "") + ":" : "";
    let minutes = matches[2] ? matches[2].replace("M", "").padStart(2, "0") + ":" : "00:";
    let seconds = matches[3] ? matches[3].replace("S", "").padStart(2, "0") : "00";
    return `${hours}${minutes}${seconds}`;
}
