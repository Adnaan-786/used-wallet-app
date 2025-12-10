import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  FileText,
  User,
  LogOut,
  Wallet
} from 'lucide-react'
import { logout, reset } from '../../features/auth/authSlice'

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.isAdmin

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/home' },
    ...(isAdmin ? [{ name: 'Users', icon: Users, path: '/users' }] : []),
    { name: 'Transactions', icon: ArrowRightLeft, path: '/transactions' },
    { name: 'Requests', icon: FileText, path: '/requests' },
    { name: 'Profile', icon: User, path: '/profile' },
  ]

  return (
    <motion.div
      className="h-screen bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-xl z-50 flex flex-col fixed left-0 top-0"
      initial={{ width: '80px' }}
      animate={{ width: isExpanded ? '240px' : '80px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap"
              >
                EasyPay
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.name} to={item.path}>
              <div
                className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon
                  className={`w-6 h-6 min-w-[24px] transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator Dot */}
                {!isExpanded && isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full"
                  />
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
        >
          <LogOut className="w-6 h-6 min-w-[24px] text-gray-400 group-hover:text-red-500" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}

export default Sidebar
