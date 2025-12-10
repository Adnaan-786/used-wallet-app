import React, { useState } from 'react'
import walletService from '../../features/wallet/walletService'
import { toast } from 'react-toastify'
import './WalletSetup.scss' // Reuse styles

const UnlockWallet = ({ onUnlock }) => {
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleUnlock = async () => {
        setIsLoading(true)
        try {
            const wallet = await walletService.loadWallet(password)
            if (wallet) {
                toast.success('Wallet unlocked!')
                onUnlock(wallet)
            } else {
                toast.error('Failed to load wallet')
            }
        } catch (error) {
            console.error(error)
            toast.error('Incorrect password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='wallet-setup'>
            <div className='container'>
                <h1>Welcome Back</h1>
                <p style={{ marginBottom: '20px', color: '#666' }}>Enter your password to unlock your wallet.</p>

                <div className='password-form'>
                    <input
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    />
                    <button onClick={handleUnlock} disabled={isLoading} className='btn-primary'>
                        {isLoading ? 'Unlocking...' : 'Unlock Wallet'}
                    </button>
                </div>

                <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
                    Forgot password? You will need to reset and restore from your seed phrase.
                </div>
            </div>
        </div>
    )
}

export default UnlockWallet
