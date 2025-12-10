import './SendModal.scss'
import { toast } from 'react-toastify'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState, useEffect } from 'react'
import Loader from '../Loader/Loader'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useUserBalance from '../../hooks/useUserBalance'

const SellModal = ({ setSellModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Details, 2: Payment Method
    const [formData, setFormData] = useState({
        country: 'India',
        units: '',
        paymentMethodType: 'Bank', // Bank or UPI
        bankDetails: {
            accountNo: '',
            ifsc: '',
            bankName: '',
        },
        upiId: '',
        password: '',
    })
    const [unitPrice, setUnitPrice] = useState(90) // Default, fetch from backend ideally

    const { user } = useSelector((state) => state.auth)
    const { available } = useUserBalance()

    const { country, units, paymentMethodType, bankDetails, upiId, password } = formData

    useEffect(() => {
        // Fetch unit price from backend if endpoint exists
        // const fetchPrice = async () => { ... }
        // fetchPrice()
    }, [])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onBankChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            bankDetails: {
                ...prevState.bankDetails,
                [e.target.name]: e.target.value,
            },
        }))
    }

    const handleNext = (e) => {
        e.preventDefault()
        if (Number(units) > available) {
            toast.error('Insufficient available balance')
            return
        }
        setStep(2)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const paymentMethod = paymentMethodType === 'Bank' ? bankDetails : { upiId }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            await axios.post('/api/sell/request', {
                country,
                unitPrice,
                totalUnits: Number(units),
                paymentMethod,
                password
            }, config)

            toast.success('Sell request submitted!')
            setSellModalOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Sell failed: ' + (error.response?.data?.message || error.message))
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
                            <h1>Sell USDT</h1>
                            <div className='closeIconContainer' onClick={() => setSellModalOpen(false)}>
                                <CloseRoundedIcon className='closeIcon' />
                            </div>
                        </div>
                        <div className='sendModalContent'>
                            <section className='sendForm'>
                                {step === 1 ? (
                                    <form onSubmit={handleNext}>
                                        <div className='formControl'>
                                            <label>Available Balance</label>
                                            <div className='address-box' style={{ justifyContent: 'center', background: '#e0f7fa', color: '#006064' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{available.toFixed(2)} USDT</span>
                                            </div>
                                        </div>
                                        <div className='formControl'>
                                            <label htmlFor='country'>Select Country</label>
                                            <select name='country' value={country} onChange={onChange} required>
                                                <option value='India'>India</option>
                                                <option value='Pakistan'>Pakistan</option>
                                                <option value='Nepal'>Nepal</option>
                                                <option value='Bangladesh'>Bangladesh</option>
                                            </select>
                                        </div>
                                        <div className='formControl'>
                                            <label htmlFor='units'>Units to Sell (USDT)</label>
                                            <input
                                                type='number'
                                                name='units'
                                                id='units'
                                                value={units}
                                                onChange={onChange}
                                                max={available}
                                                required
                                            />
                                        </div>
                                        <div className='formControl'>
                                            <label>Total Value (Approx)</label>
                                            <div className='address-box' style={{ justifyContent: 'center' }}>
                                                <span style={{ fontWeight: 'bold' }}>{(Number(units) * unitPrice).toFixed(2)} INR</span>
                                            </div>
                                            <small>Rate: 1 USDT = {unitPrice} INR</small>
                                        </div>
                                        <button className='btn' type='submit'>
                                            Next: Payment Details
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={onSubmit}>
                                        <div className='formControl'>
                                            <label>Payment Method</label>
                                            <select name='paymentMethodType' value={paymentMethodType} onChange={onChange}>
                                                <option value='Bank'>Bank Transfer</option>
                                                <option value='UPI'>UPI</option>
                                            </select>
                                        </div>

                                        {paymentMethodType === 'Bank' ? (
                                            <>
                                                <div className='formControl'>
                                                    <label>Bank Name</label>
                                                    <input type='text' name='bankName' value={bankDetails.bankName} onChange={onBankChange} required />
                                                </div>
                                                <div className='formControl'>
                                                    <label>Account Number</label>
                                                    <input type='text' name='accountNo' value={bankDetails.accountNo} onChange={onBankChange} required />
                                                </div>
                                                <div className='formControl'>
                                                    <label>IFSC Code</label>
                                                    <input type='text' name='ifsc' value={bankDetails.ifsc} onChange={onBankChange} required />
                                                </div>
                                            </>
                                        ) : (
                                            <div className='formControl'>
                                                <label>UPI ID</label>
                                                <input type='text' name='upiId' value={upiId} onChange={onChange} required placeholder='user@upi' />
                                            </div>
                                        )}

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

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type='button' className='btn' style={{ background: '#9ca3af' }} onClick={() => setStep(1)}>Back</button>
                                            <button className='btn' type='submit'>Submit Sell Request</button>
                                        </div>
                                    </form>
                                )}
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SellModal
