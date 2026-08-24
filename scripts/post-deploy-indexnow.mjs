// IndexNow protocol submission script for ironprairiefabrication.com
// Notifies Bing, Copilot, ChatGPT Search, Yandex, and DuckDuckGo of all live routes.

const API_KEY = "53c078864d4b4fb2a69dfd5291244304";
const HOST = "ironprairiefabrication.com";
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/storefront`,
  `https://${HOST}/paddle-blinds`,
  `https://${HOST}/about`,
  `https://${HOST}/services`,
  `https://${HOST}/projects`,
  `https://${HOST}/woman-owned`,
  `https://${HOST}/contact`,
  `https://${HOST}/privacy-policy`,
  `https://${HOST}/terms-of-service`
];

async function submitIndexNow() {
  console.log(`[IndexNow] Submitting ${URL_LIST.length} URLs to IndexNow API for ${HOST}...`);
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        host: HOST,
        key: API_KEY,
        keyLocation: KEY_LOCATION,
        urlList: URL_LIST
      })
    });

    if (response.ok || response.status === 202) {
      console.log(`[IndexNow] ✅ Successfully submitted URLs. HTTP Status: ${response.status}`);
    } else {
      console.error(`[IndexNow] ⚠️ Submission returned status: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error("[IndexNow] ❌ Error submitting to IndexNow:", err.message);
  }
}

submitIndexNow();
