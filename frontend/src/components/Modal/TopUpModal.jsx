import { toast } from 'react-toastify'
import { useState } from 'react'
import Loader from '../Loader/Loader'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Upload, CheckCircle } from 'lucide-react'

const TopUpModal = ({ setTopUpModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        amount: '',
        tx_id_15: '',
    })
    const [screenshot, setScreenshot] = useState(null)

    const { user } = useSelector((state) => state.auth)
    const { amount, tx_id_15 } = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (tx_id_15.length !== 15) {
            toast.error('Transaction ID must be exactly 15 characters')
            setIsLoading(false)
            return
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const formDataToSend = new FormData()
            formDataToSend.append('amount', amount)
            formDataToSend.append('tx_id_15', tx_id_15)
            if (screenshot) {
                formDataToSend.append('screenshot', screenshot)
            }

            await axios.post('/api/topup/submit', formDataToSend, config)

            toast.success('Top Up request submitted!')
            setTopUpModalOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Top Up failed: ' + (error.response?.data?.message || error.message))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setTopUpModalOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden m-4"
                >
                    {isLoading && (
                        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <Loader />
                        </div>
                    )}

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800">Top Up USDT</h2>
                        <button
                            onClick={() => setTopUpModalOpen(false)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                        {/* Admin Address */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                Admin TRC20 Address
                            </label>
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-sm font-mono text-gray-600 break-all">
                                    TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
                                </code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')
                                        toast.success('Address copied!')
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Copy Address"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            {/* Amount Input */}
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    value={amount}
                                    onChange={onChange}
                                    className="peer w-full h-12 px-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="amount"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none"
                                >
                                    Amount (USDT)
                                </label>
                            </div>

                            {/* Tx ID Input */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="tx_id_15"
                                    id="tx_id_15"
                                    value={tx_id_15}
                                    onChange={onChange}
                                    maxLength={15}
                                    minLength={15}
                                    className="peer w-full h-12 px-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="tx_id_15"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none"
                                >
                                    Transaction ID (15 chars)
                                </label>
                            </div>

                            {/* File Upload */}
                            <div className="relative">
                                <input
                                    type="file"
                                    name="screenshot"
                                    id="screenshot"
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                            if (file.size > 500 * 1024) {
                                                toast.error('File size exceeds 500KB')
                                                e.target.value = null
                                                setScreenshot(null)
                                                return
                                            }
                                            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                                                toast.error('Only JPG and PNG files are allowed')
                                                e.target.value = null
                                                setScreenshot(null)
                                                return
                                            }
                                            setScreenshot(file)
                                        }
                                    }}
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    required
                                />
                                <div className={`w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${screenshot ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}>
                                    {screenshot ? (
                                        <>
                                            <CheckCircle className="text-green-500" size={24} />
                                            <span className="text-sm font-medium text-green-700 truncate max-w-[200px]">{screenshot.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="text-gray-400" size={24} />
                                            <span className="text-sm text-gray-500">Click to upload screenshot</span>
                                            <span className="text-xs text-gray-400">Max 500KB (JPG/PNG)</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                Submit Top Up
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default TopUpModal
