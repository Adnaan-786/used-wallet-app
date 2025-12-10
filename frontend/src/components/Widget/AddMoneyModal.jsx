import React from 'react'
import '../Modal/SendModal.scss'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useSelector, useDispatch } from 'react-redux'
import { addBalance, reset } from '../../features/transactions/transactionSlice'
import Loader from '../Loader/Loader'

const AddMoneyModal = ({ setAddMoneyModal, currentAccount }) => {
  const addMoneyClose = () => {
    setAddMoneyModal(false)
  }

  return (
    <div className='sendmodal'>
      <div className='sendModalContainer'>
        <div className='sendModalHeader'>
          <h1>Receive ETH</h1>
          <div className='closeIconContainer' onClick={addMoneyClose}>
            <CloseRoundedIcon className='closeIcon' />
          </div>
        </div>
        <div className='sendModalContent'>
          <section className='sendForm'>
            <div className='formControl'>
              <label>Your Wallet Address</label>
              <div style={{
                padding: '10px',
                background: '#f5f5f5',
                borderRadius: '5px',
                wordBreak: 'break-all',
                marginTop: '10px',
                border: '1px solid #ddd'
              }}>
                {currentAccount || 'Please connect your wallet'}
              </div>
              <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                Scan this address to receive ETH or tokens.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AddMoneyModal
