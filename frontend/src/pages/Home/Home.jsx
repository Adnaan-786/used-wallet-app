import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import TopUpModal from '../../components/Modal/TopUpModal'
import WithdrawModal from '../../components/Modal/WithdrawModal'
import SellModal from '../../components/Modal/SellModal'
import TransactionHistory from '../../components/TransactionHistory/TransactionHistory'
import { useDispatch, useSelector } from 'react-redux'
import useUserBalance from '../../hooks/useUserBalance'

// New UI Components
import LayoutWrapper from '../../components/Layout/LayoutWrapper'
import GlassCard from '../../components/UI/GlassCard'
import ShimmerButton from '../../components/UI/ShimmerButton'
import { Wallet, ArrowUpRight, ArrowDownLeft, Banknote, Lock, DollarSign } from 'lucide-react'

const Home = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { available, frozen, total } = useUserBalance()

  const [topUpModalOpen, setTopUpModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [sellModalOpen, setSellModalOpen] = useState(false)

  if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <LayoutWrapper>
      <div className='flex'>
        <Sidebar /> {/* Assuming Sidebar is compatible or will be refactored later, keeping as is for now */}

        <div className='flex-1 flex flex-col min-h-screen ml-[80px]'>
          <Navbar currentAccount={user.uid_username} />

          <main className='p-6 max-w-7xl mx-auto w-full space-y-8 mt-4'>

            {/* Bento Grid: Balances */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Balance - Large Card */}
              <GlassCard className="md:col-span-3 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Assets</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold text-gray-900">{total.toFixed(2)}</span>
                      <span className="text-lg font-medium text-gray-500">USDT</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-100/50 rounded-full text-blue-600">
                    <Wallet size={32} />
                  </div>
                </div>
              </GlassCard>

              {/* Available Balance */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium text-sm uppercase">Available</h3>
                  <div className="p-2 bg-emerald-100/50 rounded-full text-emerald-600">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{available.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">USDT</span>
                </div>
              </GlassCard>

              {/* Frozen Balance */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium text-sm uppercase">Frozen / Locked</h3>
                  <div className="p-2 bg-rose-100/50 rounded-full text-rose-600">
                    <Lock size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{frozen.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">USDT</span>
                </div>
              </GlassCard>

              {/* Quick Actions Card */}
              <GlassCard className="flex flex-row items-center justify-around p-4">
                {/* This card is just a placeholder or can be removed if buttons are enough */}
                <span className="text-gray-400 text-sm font-medium">Quick Actions</span>
              </GlassCard>
            </section>

            {/* Action Buttons Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ShimmerButton variant="success" onClick={() => setTopUpModalOpen(true)} className="h-16 text-lg">
                <ArrowDownLeft size={24} /> TOP UP
              </ShimmerButton>
              <ShimmerButton variant="danger" onClick={() => setWithdrawModalOpen(true)} className="h-16 text-lg">
                <ArrowUpRight size={24} /> WITHDRAW
              </ShimmerButton>
              <ShimmerButton variant="primary" onClick={() => setSellModalOpen(true)} className="h-16 text-lg">
                <Banknote size={24} /> SELL / TRADE
              </ShimmerButton>
            </section>

            {/* Transaction History */}
            <section className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
              <div className="h-[400px]">
                <TransactionHistory />
              </div>
            </section>

          </main>

          {/* Modals */}
          {topUpModalOpen && <TopUpModal setTopUpModalOpen={setTopUpModalOpen} />}
          {withdrawModalOpen && <WithdrawModal setWithdrawModalOpen={setWithdrawModalOpen} />}
          {sellModalOpen && <SellModal setSellModalOpen={setSellModalOpen} />}
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default Home
