chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'MERN_WALLET_REQUEST') {
        console.log('[Background] Received request:', request)

        // TODO: Handle actual RPC methods here (eth_requestAccounts, eth_sendTransaction, etc.)
        // For now, we mock responses to verify connectivity.

        if (request.method === 'eth_requestAccounts') {
            // Mock account return
            sendResponse({
                result: ['0x1234567890123456789012345678901234567890']
            })
        } else if (request.method === 'eth_chainId') {
            sendResponse({ result: '0xaa36a7' }) // Sepolia
        } else {
            sendResponse({
                error: { code: -32601, message: 'Method not implemented' }
            })
        }

        return true // Keep channel open for async response
    }
})
