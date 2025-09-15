
import React from 'react';

const UsdtIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
        <circle cx="50" cy="50" r="50" fill="#26A17B"/>
        <path d="M62.5,35H37.5V25h25V35Z" fill="#FFF"/>
        <path d="M43.75,62.5V35h-12.5V62.5H25V75H43.75v-12.5Z" fill="#FFF"/>
        <path d="M68.75,35h-12.5V75H75V62.5H68.75V35Z" fill="#FFF"/>
    </svg>
);

export default UsdtIcon;
