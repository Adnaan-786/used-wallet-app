// Inject injected.js
const script = document.createElement('script')
script.src = chrome.runtime.getURL('injected.js')
script.onload = function () {
    this.remove()
}
    (document.head || document.documentElement).appendChild(script)

// Listen for messages from injected.js
window.addEventListener('message', (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) return

    if (event.data.type && event.data.type === 'MERN_WALLET_REQUEST') {
        // Relay to background.js
        chrome.runtime.sendMessage(event.data, (response) => {
            // Relay response back to injected.js
            window.postMessage({
                type: 'MERN_WALLET_RESPONSE',
                id: event.data.id,
                ...response
            }, '*')
        })
    }
})

// Listen for messages from background.js (e.g. events)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'MERN_WALLET_EVENT') {
        window.postMessage(message, '*')
    }
})
