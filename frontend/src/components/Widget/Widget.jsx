import {
  AccountBalanceWalletRounded,
  MonetizationOnRounded,
} from '@mui/icons-material'
import './Widget.scss'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import { useState } from 'react'
import TopUpModal from '../Modal/TopUpModal'
import WithdrawModal from '../Modal/WithdrawModal'
import SellModal from '../Modal/SellModal'

const Widget = ({ type, balance }) => {
  const [topUpModalOpen, setTopUpModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [sellModalOpen, setSellModalOpen] = useState(false)

  let data

  // INR Currency Formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  // USDT Formatter
  const formatUSDT = (amount) => {
    return `${parseFloat(amount).toFixed(2)} USDT`
  }

  switch (type) {
    case 'balance_available':
      data = {
        title: 'AVAILABLE USDT',
        isMoney: true,
        isBalance: true,
        link: 'See details',
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className='icon'
            style={{
              backgroundColor: 'rgba(128, 0, 128, 0.2)',
              color: 'purple',
            }}
          />
        ),
      }
      break
    case 'balance_frozen':
      data = {
        title: 'FROZEN USDT',
        isMoney: true,
        isBalance: true,
        link: 'Locked in processing',
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className='icon'
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              color: 'crimson',
            }}
          />
        ),
      }
      break
    case 'balance_total':
      data = {
        title: 'TOTAL USDT',
        isMoney: true,
        isBalance: true,
        link: 'Total Assets',
        icon: (
          <MonetizationOnOutlinedIcon
            className='icon'
            style={{
              backgroundColor: 'rgba(0, 128, 0, 0.2)',
              color: 'green',
            }}
          />
        ),
      }
      break
    case 'sell':
      data = {
        title: 'SELL USDT',
        isMoney: false,
        link: 'Sell for Fiat',
        icon: (
          <MonetizationOnOutlinedIcon
            className='icon'
            style={{
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              color: 'orange',
            }}
          />
        ),
        action: () => setSellModalOpen(true),
      }
      break
    case 'user':
      // Keeping 'user' as Withdraw shortcut for now, or can remove if redundant
      data = {
        title: 'WITHDRAW',
        isMoney: false,
        link: 'Withdraw funds',
        icon: (
          <PersonOutlinedIcon
            className='icon'
            style={{
              color: 'crimson',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
            }}
          />
        ),
        action: () => setWithdrawModalOpen(true),
      }
      break
    case 'order':
      // Keeping 'order' as Top Up shortcut
      data = {
        title: 'TOP UP',
        isMoney: false,
        link: 'Add funds',
        icon: (
          <ShoppingCartOutlinedIcon
            className='icon'
            style={{
              backgroundColor: 'rgba(218, 165, 32, 0.2)',
              color: 'goldenrod',
            }}
          />
        ),
        action: () => setTopUpModalOpen(true),
      }
      break
  }

  return (
    <div className='widget'>
      <div className='left'>
        <span className='title'>{data.title}</span>
        <span className='counter'>
          {data.isBalance ? formatUSDT(balance || 0) : data.isMoney && formatCurrency(100)}
        </span>
        <span
          className='link'
          onClick={data.action ? data.action : null}
          style={{ cursor: data.action ? 'pointer' : 'default' }}
        >
          {data.link}
        </span>
      </div>
      <div className='right'>
        <div className='percentage positive'>
          <KeyboardArrowUpIcon />
          {20} %
        </div>
        {data.icon}
      </div>
      {topUpModalOpen && <TopUpModal setTopUpModalOpen={setTopUpModalOpen} />}
      {withdrawModalOpen && <WithdrawModal setWithdrawModalOpen={setWithdrawModalOpen} />}
      {sellModalOpen && <SellModal setSellModalOpen={setSellModalOpen} />}
    </div>
  )
}

export default Widget
