import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Avatar from '../../assets/avatar.png'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const Navbar = ({ currentAccount, connectWallet }) => {
  const { name, image, isAdmin } = useSelector((state) => state.auth.user)

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className='sticky top-4 z-40 mx-auto w-[95%] max-w-7xl'
    >
      <div className='bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-6 py-3 flex items-center justify-between'>
        {/* Search */}
        <div className='flex items-center bg-gray-100/50 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-500/50 focus-within:bg-white transition-all duration-300'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent border-none outline-none text-sm w-32 sm:w-64 text-gray-700 placeholder-gray-400'
          />
          <SearchRoundedIcon className='text-gray-400 w-5 h-5' />
        </div>

        {/* Right Side Items */}
        <div className='flex items-center gap-6'>
          {/* Admin Tag */}
          {isAdmin && (
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full border border-blue-200">
              ADMIN
            </span>
          )}

          {/* User Profile */}
          <div className='flex items-center gap-3 pl-6 border-l border-gray-200'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-bold text-gray-800'>{name}</p>
              <p className='text-xs text-gray-500'>Verified User</p>
            </div>
            <div className='relative group cursor-pointer'>
              <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <img
                src={image || Avatar}
                alt={name}
                className='w-10 h-10 rounded-full object-cover border-2 border-white relative z-10'
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Navbar
