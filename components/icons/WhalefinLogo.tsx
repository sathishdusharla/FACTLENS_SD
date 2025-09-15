import React from 'react';

const WhalefinLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 175 32" fill="white" xmlns="http://www.w3.org/2000/svg" {...props}>
        <style>
            {`.logo-font { font-family: 'Archivo Black', sans-serif; font-size: 28px; letter-spacing: -1px; }`}
        </style>
        <text x="0" y="25" className="logo-font">FACT</text>
        <text x="88" y="25" className="logo-font" fill="#3B82F6">LENS</text>
    </svg>
);

export default WhalefinLogo;