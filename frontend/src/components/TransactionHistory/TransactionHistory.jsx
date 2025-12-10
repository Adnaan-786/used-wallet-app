import './TransactionHistory.scss'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const TransactionHistory = () => {
    const [data, setData] = useState([])
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                // Assuming endpoints exist
                const topupsRes = await axios.get('/api/topups/my', config)
                const withdrawalsRes = await axios.get('/api/withdrawals/my', config)

                const topups = topupsRes.data.map(t => ({ ...t, type: 'TopUp', id: `T-${t.id}` }))
                const withdrawals = withdrawalsRes.data.map(w => ({ ...w, type: 'Withdrawal', id: `W-${w.id}` }))

                setData([...topups, ...withdrawals].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
            } catch (error) {
                console.error('Error fetching history:', error)
            }
        }
        if (user) fetchData()
    }, [user])

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'type', headerName: 'Type', width: 120 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.status.toLowerCase()}`}>
                        {params.row.status}
                    </div>
                )
            },
        },
        { field: 'created_at', headerName: 'Date', width: 200 },
    ]

    return (
        <div className='transactionHistory' style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection={false}
            />
        </div>
    )
}

export default TransactionHistory
