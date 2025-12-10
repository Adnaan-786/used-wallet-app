import { ethers } from 'ethers'

const RPC_URL = 'https://rpc.sepolia.org' // Default to Sepolia Testnet

const walletService = {
    // Create a new random wallet
    createWallet: async () => {
        const wallet = ethers.Wallet.createRandom()
        return {
            address: wallet.address,
            mnemonic: wallet.mnemonic.phrase,
            privateKey: wallet.privateKey,
            walletInstance: wallet,
        }
    },

    // Import wallet from mnemonic
    importWallet: async (mnemonic) => {
        try {
            const wallet = ethers.Wallet.fromPhrase(mnemonic)
            return {
                address: wallet.address,
                mnemonic: wallet.mnemonic.phrase,
                privateKey: wallet.privateKey,
                walletInstance: wallet,
            }
        } catch (error) {
            throw new Error('Invalid mnemonic phrase')
        }
    },

    // Encrypt and save wallet to localStorage
    saveWallet: async (wallet, password) => {
        const encryptedJson = await wallet.encrypt(password)
        localStorage.setItem('encryptedWallet', encryptedJson)
        return true
    },

    // Load and decrypt wallet from localStorage
    loadWallet: async (password) => {
        const encryptedJson = localStorage.getItem('encryptedWallet')
        if (!encryptedJson) return null

        try {
            const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password)
            return wallet
        } catch (error) {
            throw new Error('Incorrect password')
        }
    },

    // Check if a wallet is saved locally
    hasSavedWallet: () => {
        return !!localStorage.getItem('encryptedWallet')
    },

    // Get Provider
    getProvider: () => {
        return new ethers.JsonRpcProvider(RPC_URL)
    },

    // Get Balance
    getBalance: async (address) => {
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const balance = await provider.getBalance(address)
        return ethers.formatEther(balance)
    },

    // Send Transaction
    sendTransaction: async (wallet, receiver, amount) => {
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const connectedWallet = wallet.connect(provider)

        const tx = await connectedWallet.sendTransaction({
            to: receiver,
            value: ethers.parseEther(amount),
        })

        return tx
    },
}

export default walletService
