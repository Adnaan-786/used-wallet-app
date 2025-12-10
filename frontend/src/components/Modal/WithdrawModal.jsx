import './SendModal.scss' // Reusing SendModal styles
import { toast } from 'react-toastify'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState, useEffect } from 'react'
import Loader from '../Loader/Loader'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useUserBalance from '../../hooks/useUserBalance'

const WithdrawModal = ({ setWithdrawModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        amount: '',
        wallet_address: '',
        password: '',
    })
    const [isAddressEditable, setIsAddressEditable] = useState(false)

    const { user } = useSelector((state) => state.auth)
    const { available } = useUserBalance()

    // Pre-fill wallet address if available in user profile (assuming it's stored)
    useEffect(() => {
        if (user?.wallet?.trc20_address) {
            setFormData(prev => ({ ...prev, wallet_address: user.wallet.trc20_address }))
        }
    }, [user])

    const { amount, wallet_address, password } = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (Number(amount) > available) {
            toast.error('Insufficient available balance')
            setIsLoading(false)
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            await axios.post('/api/withdraw/request', { amount, wallet_address, password }, config)

            toast.success('Withdrawal request submitted!')
            setWithdrawModalOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Withdrawal failed: ' + (error.response?.data?.message || error.message))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='sendmodal'>
            <div className='sendModalContainer'>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className='sendModalHeader'>
                            <h1>Withdraw USDT</h1>
                            <div className='closeIconContainer' onClick={() => setWithdrawModalOpen(false)}>
                                <CloseRoundedIcon className='closeIcon' />
                            </div>
                        </div>
                        <div className='sendModalContent'>
                            <section className='sendForm'>
                                <div className='formControl'>
                                    <label>Available Balance</label>
                                    <div className='address-box' style={{ justifyContent: 'center', background: '#e0f7fa', color: '#006064' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{available.toFixed(2)} USDT</span>
                                    </div>
                                </div>
                                <form onSubmit={onSubmit}>
                                    <div className='formControl'>
                                        <label htmlFor='amount'>Amount (USDT)</label>
                                        <input
                                            type='number'
                                            name='amount'
                                            id='amount'
                                            value={amount}
                                            onChange={onChange}
                                            max={available}
                                            required
                                        />
                                    </div>
                                    <div className='formControl'>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label htmlFor='wallet_address'>Your TRC20 Address</label>
                                            <button
                                                type='button'
                                                onClick={() => setIsAddressEditable(true)}
                                                style={{ border: 'none', background: 'transparent', color: '#007bff', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                Revise
                                            </button>
                                        </div>
                                        <input
                                            type='text'
                                            name='wallet_address'
                                            id='wallet_address'
                                            value={wallet_address}
                                            onChange={onChange}
                                            placeholder='T...'
                                            disabled={!isAddressEditable}
                                            required
                                        />
                                    </div>
                                    <div className='formControl'>
                                        <label htmlFor='password'>Confirm Password</label>
                                        <input
                                            type='password'
                                            name='password'
                                            id='password'
                                            value={password}
                                            onChange={onChange}
                                            required
                                            placeholder='Enter login password'
                                        />
                                    </div>
                                    <button className='btn' type='submit'>
                                        Request Withdrawal
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

export default WithdrawModal
