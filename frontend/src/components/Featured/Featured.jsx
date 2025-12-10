import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  MoreVertRounded,
} from '@mui/icons-material'
import './Featured.scss'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useEffect, useState } from 'react'
import cryptoService from '../../features/crypto/cryptoService'
import { INRupee } from '../../pages/utils/helpOptions'

const Featured = () => {
  const [btcData, setBtcData] = useState({ price: 0, change: 0 })

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await cryptoService.getCryptoPrices()
        if (data && data.bitcoin) {
          setBtcData({
            price: data.bitcoin.inr,
            change: data.bitcoin.inr_24h_change,
          })
        }
      } catch (error) {
        console.error('Failed to fetch crypto price', error)
      }
    }

    fetchPrice()
  }, [])

  return (
    <div className='featured'>
      <div className='top'>
        <h1 className='title'>Bitcoin Price</h1>
        <MoreVertRounded fontSize='small' />
      </div>
      <div className='bottom'>
        <div className='featuredChart'>
          <CircularProgressbar
            value={Math.abs(btcData.change).toFixed(2)}
            text={`${btcData.change.toFixed(2)}%`}
            strokeWidth={4}
            styles={{
              path: {
                stroke: btcData.change >= 0 ? 'green' : 'red',
              },
              text: {
                fill: btcData.change >= 0 ? 'green' : 'red',
              },
            }}
          />
        </div>
        <p className='title'>Current Price (INR)</p>
        <p className='amount'>{INRupee.format(btcData.price)}</p>
        <p className='desc'>
          Live Bitcoin price fetched from CoinGecko.
        </p>
        <div className='summary'>
          <div className='item'>
            <div className='itemTitle'>24h Change</div>
            <div className={`itemResult ${btcData.change >= 0 ? 'positive' : 'negative'}`}>
              {btcData.change >= 0 ? <KeyboardArrowUpRounded fontSize='small' /> : <KeyboardArrowDownRounded fontSize='small' />}
              <div className='resultAmount'>{Math.abs(btcData.change).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Featured
