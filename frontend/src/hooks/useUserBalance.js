import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const useUserBalance = () => {
    const { user } = useSelector((state) => state.auth)
    const [balanceData, setBalanceData] = useState({
        available: 0,
        frozen: 0,
        total: 0,
        loading: true,
        error: null,
    })

    useEffect(() => {
        const fetchBalance = async () => {
            if (!user || !user.token) return

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }

                // Fetch current user to get latest wallet data
                const response = await axios.get('/api/users/current_user', config)
                const wallet = response.data.wallet

                if (wallet) {
                    setBalanceData({
                        available: Number(wallet.balance_available),
                        frozen: Number(wallet.balance_frozen),
                        total: Number(wallet.balance_total),
                        loading: false,
                        error: null,
                    })
                } else {
                    // Fallback if wallet is missing in response
                    setBalanceData(prev => ({ ...prev, loading: false }))
                }
            } catch (error) {
                console.error('Error fetching balance:', error)
                setBalanceData((prev) => ({
                    ...prev,
                    loading: false,
                    error: error.message,
                }))
            }
        }

        fetchBalance()
        // Poll every 10 seconds to keep balance updated
        const interval = setInterval(fetchBalance, 10000)

        return () => clearInterval(interval)
    }, [user])

    return balanceData
}

export default useUserBalance
