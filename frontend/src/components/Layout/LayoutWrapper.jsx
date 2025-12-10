import React from 'react';

const LayoutWrapper = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-white bg-dot-pattern relative overflow-x-hidden">
            {/* Mesh Gradient Overlay (Optional, subtle) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-purple-50/50 to-pink-50/50 pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default LayoutWrapper;
