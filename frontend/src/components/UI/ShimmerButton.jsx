import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const ShimmerButton = ({ children, onClick, className, variant = 'primary' }) => {
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30",
        success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
        danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/30",
        warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/30",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={clsx(
                "relative overflow-hidden px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300",
                variants[variant],
                className
            )}
            onClick={onClick}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer-slide bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default ShimmerButton;
