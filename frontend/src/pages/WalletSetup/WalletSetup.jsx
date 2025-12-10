import React, { useState } from 'react'
import walletService from '../../features/wallet/walletService'
import { toast } from 'react-toastify'
import './WalletSetup.scss'

const WalletSetup = ({ onWalletSetupComplete }) => {
    const [step, setStep] = useState('initial') // initial, create, import
    const [mnemonic, setMnemonic] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [importMnemonic, setImportMnemonic] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleCreateWallet = async () => {
        const wallet = await walletService.createWallet()
        setMnemonic(wallet.mnemonic)
        setStep('create_confirm')
    }

    const handleSaveWallet = async (walletInstance) => {
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)
        try {
            await walletService.saveWallet(walletInstance, password)
            toast.success('Wallet created and saved successfully!')
            onWalletSetupComplete(walletInstance)
        } catch (error) {
            console.error(error)
            toast.error('Failed to save wallet')
        } finally {
            setIsLoading(false)
        }
    }

    const confirmCreate = async () => {
        // Re-derive wallet from the displayed mnemonic to ensure consistency
        const wallet = await walletService.importWallet(mnemonic)
        await handleSaveWallet(wallet.walletInstance)
    }

    const handleImportWallet = async () => {
        try {
            const wallet = await walletService.importWallet(importMnemonic)
            await handleSaveWallet(wallet.walletInstance)
        } catch (error) {
            toast.error('Invalid mnemonic phrase')
        }
    }

    return (
        <div className='wallet-setup'>
            <div className='container'>
                <h1>Setup Your Wallet</h1>

                {step === 'initial' && (
                    <div className='options'>
                        <button onClick={handleCreateWallet} className='btn-primary'>Create New Wallet</button>
                        <button onClick={() => setStep('import')} className='btn-secondary'>Import Existing Wallet</button>
                    </div>
                )}

                {step === 'create_confirm' && (
                    <div className='create-flow'>
                        <div className='mnemonic-box'>
                            <h3>Your Secret Recovery Phrase</h3>
                            <p>Write this down and keep it safe. You will need it to recover your wallet.</p>
                            <div className='phrase'>{mnemonic}</div>
                        </div>

                        <div className='password-form'>
                            <input
                                type='password'
                                placeholder='Set a strong password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button onClick={confirmCreate} disabled={isLoading} className='btn-primary'>
                                {isLoading ? 'Encrypting & Saving...' : 'I have saved my phrase & Set Password'}
                            </button>
                        </div>
                        <button onClick={() => setStep('initial')} className='btn-text'>Back</button>
                    </div>
                )}

                {step === 'import' && (
                    <div className='import-flow'>
                        <textarea
                            placeholder='Enter your 12 or 24 word mnemonic phrase'
                            value={importMnemonic}
                            onChange={(e) => setImportMnemonic(e.target.value)}
                        />
                        <div className='password-form'>
                            <input
                                type='password'
                                placeholder='Set a strong password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button onClick={handleImportWallet} disabled={isLoading} className='btn-primary'>
                                {isLoading ? 'Importing & Encrypting...' : 'Import Wallet'}
                            </button>
                        </div>
                        <button onClick={() => setStep('initial')} className='btn-text'>Back</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WalletSetup
