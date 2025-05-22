/// background.js
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "TRANSLATE_CHUNK") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${message.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a professional translator. Translate the following text to natural, fluent French, preserving context and meaning."
            },
            {
              role: "user",
              content: message.text
            }
          ],
          temperature: 0.3
        })
      });
  
      const data = await response.json();
      sendResponse({ translation: data.choices[0].message.content });
    }
    return true;
  });