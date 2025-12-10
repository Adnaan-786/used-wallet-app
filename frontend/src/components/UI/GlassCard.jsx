import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const GlassCard = ({ children, className, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={clsx(
                "bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6",
                "hover:shadow-2xl hover:border-blue-500/30 transition-colors duration-300",
                "flex flex-col justify-between",
                className
            )}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
