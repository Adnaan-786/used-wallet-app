import './SendModal.scss'
import { toast } from 'react-toastify'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState } from 'react'
import walletService from '../../features/wallet/walletService'
import Loader from '../Loader/Loader'

const SendModal = ({ setSendModalOpen, currentAccount, walletInstance }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    receiver: '',
    amount: '',
  })

  const { receiver, amount } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!walletInstance) {
        toast.error('Wallet not loaded properly')
        setIsLoading(false)
        return
      }

      const tx = await walletService.sendTransaction(walletInstance, receiver, amount)
      console.log('Transaction sent:', tx)
      toast.success(`Transaction sent! Hash: ${tx.hash.slice(0, 10)}...`)
      setSendModalOpen(false)
    } catch (error) {
      console.error(error)
      toast.error('Transaction failed: ' + (error.reason || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const sendModalClose = () => {
    setSendModalOpen(false)
  }

  return (
    <div className='sendmodal'>
      <div className='sendModalContainer'>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className='sendModalHeader'>
              <h1>Send ETH</h1>
              <div className='closeIconContainer' onClick={sendModalClose}>
                <CloseRoundedIcon className='closeIcon' />
              </div>
            </div>
            <div className='sendModalContent'>
              <section className='sendForm'>
                <form onSubmit={onSubmit}>
                  <div className='formControl'>
                    <label htmlFor='senderId'>From (Your Address)</label>
                    <input
                      type='text'
                      value={currentAccount || ''}
                      disabled
                      className='disabled-input'
                    />
                  </div>
                  <div className='formControl'>
                    <label htmlFor='receiver'>Receiver Address</label>
                    <input
                      type='text'
                      name='receiver'
                      id='receiver'
                      value={receiver}
                      onChange={onChange}
                      placeholder='0x...'
                      required
                    />
                  </div>
                  <div className='formControl'>
                    <label htmlFor='amount'>Amount (ETH)</label>
                    <input
                      type='number'
                      name='amount'
                      id='amount'
                      value={amount}
                      onChange={onChange}
                      min='0.0001'
                      step='0.0001'
                      placeholder='0.1'
                      required
                    />
                  </div>
                  <button className='btn' type='submit'>
                    Send ETH
                  </button>
                </form>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SendModal
