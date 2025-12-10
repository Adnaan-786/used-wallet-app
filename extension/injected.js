class MernWalletProvider {
    constructor() {
        this.isMernWallet = true
        this.callbacks = new Map()
        this._isConnected = false
        this._initialized = false
    }

    // EIP-1193: request method
    async request({ method, params }) {
        console.log('[MernWallet] request:', method, params)
        return new Promise((resolve, reject) => {
            const id = Date.now() + Math.random().toString(36).substr(2, 9)

            const handleResponse = (event) => {
                if (event.data.type === 'MERN_WALLET_RESPONSE' && event.data.id === id) {
                    window.removeEventListener('message', handleResponse)
                    if (event.data.error) {
                        reject(event.data.error)
                    } else {
                        resolve(event.data.result)
                    }
                }
            }

            window.addEventListener('message', handleResponse)

            window.postMessage({
                type: 'MERN_WALLET_REQUEST',
                id,
                method,
                params,
                source: 'mern-wallet-injected'
            }, '*')
        })
    }

    // EIP-1193: Events
    on(event, callback) {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, [])
        }
        this.callbacks.get(event).push(callback)
    }

    removeListener(event, callback) {
        if (this.callbacks.has(event)) {
            const listeners = this.callbacks.get(event)
            const index = listeners.indexOf(callback)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }

    emit(event, data) {
        if (this.callbacks.has(event)) {
            this.callbacks.get(event).forEach(cb => cb(data))
        }
    }
}

const provider = new MernWalletProvider()

// EIP-6963: Announce Provider
const announceProvider = () => {
    const info = {
        uuid: '350670db-19fa-470d-9a28-248532397c32', // Random UUID
        name: 'Mern Wallet',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0iIzY0MzlZmYiIGQ9Ik0xNiA0bC04IDh2MTJoMTZWMTJsLTgtOHoiLz48L3N2Zz4=', // Placeholder Icon
        rdns: 'com.mernwallet'
    }

    window.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
            detail: Object.freeze({ info, provider })
        })
    )
}

window.addEventListener('eip6963:requestProvider', announceProvider)
announceProvider()

// Legacy Support
if (!window.ethereum) {
    window.ethereum = provider
} else {
    // If something else is there, we can try to coexist or overwrite depending on strategy.
    // For now, we just set our flag.
    window.ethereum.isMernWallet = true
}

console.log('[MernWallet] Provider injected')
