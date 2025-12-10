import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const TopUpForm = () => {
    const [amount, setAmount] = useState('')
    const [transactionId, setTransactionId] = useState('')
    const [screenshot, setScreenshot] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useSelector((state) => state.auth)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            setScreenshot(file)
        } else {
            toast.error('Please select a valid image file')
            setScreenshot(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (transactionId.length !== 15) {
            toast.error('Transaction ID must be exactly 15 characters')
            return
        }

        if (!screenshot) {
            toast.error('Please upload a screenshot')
            return
        }

        setIsLoading(true)

        // Mock URL creation
        const mockScreenshotUrl = URL.createObjectURL(screenshot)

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            await axios.post('/api/topup/request', {
                amount,
                transactionId,
                screenshotUrl: mockScreenshotUrl,
            }, config)

            toast.success('Top-Up Request Submitted Successfully!')
            setAmount('')
            setTransactionId('')
            setScreenshot(null)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manual Top-Up</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Transaction ID (15 chars)</label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter 15-digit ID"
                        maxLength={15}
                        minLength={15}
                        required
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">{transactionId.length}/15 characters</p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Screenshot</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    )
}

export default TopUpForm
