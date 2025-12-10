import React from 'react'
import TopUpForm from '../../components/TopUpForm'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import './TopUp.scss' // Assuming we might need some styles, or reuse existing

const TopUp = () => {
    return (
        <div className='list'>
            <Sidebar />
            <div className='listContainer'>
                <Navbar />
                <div className='p-4'>
                    <TopUpForm />
                </div>
            </div>
        </div>
    )
}

export default TopUp
