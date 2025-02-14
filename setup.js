const API_KEY = 'AIzaSyCRl5Yh4mabGYU56dKR7YP9OTUnC-nItlY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function fetchYouTubeVideos(query) {
    try {
        // Fetch videos based on search query
        const searchResponse = await fetch(`${BASE_URL}/search?part=snippet&q=${query}&type=video&key=${API_KEY}&maxResults=5`);
        const searchData = await searchResponse.json();

        if (!searchData.items) {
            throw new Error("No videos found.");
        }

        // Extract video IDs
        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // Fetch detailed video data
        const videoResponse = await fetch(`${BASE_URL}/videos?part=snippet,contentDetails&id=${videoIds}&key=${API_KEY}`);
        const videoData = await videoResponse.json();

        // Append videos to the DOM
        appendVideosToDOM(videoData.items);
    } catch (error) {
        console.error("Error fetching YouTube data:", error);
    }
}

function checkCaptions(video) {
    return video.contentDetails.caption === "true" ? "Captions available" : "No captions";
}

function appendVideosToDOM(videos) {
    const resultsContainer = document.getElementById('video-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video-item');

        videoElement.innerHTML = `
            <h3>${video.snippet.title}</h3>
            <p>${video.snippet.description}</p>
            <p>${checkCaptions(video)}</p>
            <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/${video.id}" 
                frameborder="0" allowfullscreen>
            </iframe>
        `;

        resultsContainer.appendChild(videoElement);
    });
}

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) fetchYouTubeVideos(query);
});
