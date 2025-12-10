import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import './AdminRequests.scss'

const AdminRequests = () => {
    const [topUps, setTopUps] = useState([])
    const [sells, setSells] = useState([])
    const [withdraws, setWithdraws] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useSelector((state) => state.auth)

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    }

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const topUpRes = await axios.get('/api/topup/pending', config)
            setTopUps(topUpRes.data)

            const sellRes = await axios.get('/api/sell/pending', config)
            setSells(sellRes.data)

            const withdrawRes = await axios.get('/api/withdraw/pending', config)
            setWithdraws(withdrawRes.data)
        } catch (error) {
            console.error('Error fetching requests', error)
            toast.error('Failed to fetch pending requests')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleTopUpAction = async (id, action) => {
        try {
            if (action === 'Approve') {
                await axios.post(`/api/topup/approve/${id}`, {}, config)
                toast.success('Top-Up Approved')
            } else {
                await axios.post(`/api/topup/reject/${id}`, {}, config)
                toast.info('Top-Up Rejected')
            }
            fetchData()
        } catch (error) {
            console.error('Error processing topup', error)
            toast.error('Error processing request')
        }
    }

    const handleSellAction = async (id, action) => {
        try {
            await axios.post(`/api/sell/action/${id}`, { action }, config)
            toast.success(`Sell Request ${action}d`)
            fetchData()
        } catch (error) {
            console.error('Error processing sell', error)
            toast.error('Error processing request')
        }
    }

    const handleWithdrawAction = async (id, action) => {
        try {
            await axios.post(`/api/withdraw/action/${id}`, { action }, config)
            toast.success(`Withdraw Request ${action}d`)
            fetchData()
        } catch (error) {
            console.error('Error processing withdraw', error)
            toast.error('Error processing request')
        }
    }

    return (
        <div className="admin-requests p-4">
            <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Top-Up Requests</h3>
                {topUps.length === 0 ? <p>No pending top-ups</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">User</th>
                                    <th className="py-2 px-4 border">Amount</th>
                                    <th className="py-2 px-4 border">Tx ID</th>
                                    <th className="py-2 px-4 border">Screenshot</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topUps.map((req) => (
                                    <tr key={req._id}>
                                        <td className="py-2 px-4 border">{req.userId?.name} ({req.userId?.email})</td>
                                        <td className="py-2 px-4 border">{req.amount}</td>
                                        <td className="py-2 px-4 border">{req.transactionId}</td>
                                        <td className="py-2 px-4 border">
                                            <a href={req.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <button onClick={() => handleTopUpAction(req._id, 'Approve')} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                                            <button onClick={() => handleTopUpAction(req._id, 'Reject')} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Sell Requests</h3>
                {sells.length === 0 ? <p>No pending sell requests</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">User</th>
                                    <th className="py-2 px-4 border">Country</th>
                                    <th className="py-2 px-4 border">Unit Price</th>
                                    <th className="py-2 px-4 border">Total Units</th>
                                    <th className="py-2 px-4 border">Payment</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sells.map((req) => (
                                    <tr key={req._id}>
                                        <td className="py-2 px-4 border">{req.userId?.name}</td>
                                        <td className="py-2 px-4 border">{req.country}</td>
                                        <td className="py-2 px-4 border">{req.unitPrice}</td>
                                        <td className="py-2 px-4 border">{req.totalUnits}</td>
                                        <td className="py-2 px-4 border">{req.paymentMethod?.method} - {req.paymentMethod?.details}</td>
                                        <td className="py-2 px-4 border">
                                            <button onClick={() => handleSellAction(req._id, 'Approve')} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                                            <button onClick={() => handleSellAction(req._id, 'Reject')} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Withdraw Requests</h3>
                {withdraws.length === 0 ? <p>No pending withdraw requests</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">User</th>
                                    <th className="py-2 px-4 border">Amount</th>
                                    <th className="py-2 px-4 border">Description</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdraws.map((req) => (
                                    <tr key={req._id}>
                                        <td className="py-2 px-4 border">{req.userId?.name}</td>
                                        <td className="py-2 px-4 border">{req.amount}</td>
                                        <td className="py-2 px-4 border">{req.description}</td>
                                        <td className="py-2 px-4 border">
                                            <button onClick={() => handleWithdrawAction(req._id, 'Approve')} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                                            <button onClick={() => handleWithdrawAction(req._id, 'Reject')} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminRequests
