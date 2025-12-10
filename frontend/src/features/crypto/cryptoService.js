import axios from 'axios'

const API_URL = 'https://api.coingecko.com/api/v3/simple/price'

const getCryptoPrices = async () => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                ids: 'bitcoin,ethereum,tether',
                vs_currencies: 'inr',
                include_24hr_change: 'true',
            },
        })
        return response.data
    } catch (error) {
        console.error('Error fetching crypto prices:', error)
        throw error
    }
}

const cryptoService = {
    getCryptoPrices,
}

export default cryptoService
