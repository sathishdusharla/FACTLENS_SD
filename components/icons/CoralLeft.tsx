
import React from 'react';

const CoralLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 300 300" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M150 300V250 C150 220, 130 220, 130 250 V300 Z" />
        <path d="M135 250 C120 250, 120 230, 130 220 C140 210, 150 215, 150 230" />
        <path d="M160 250 C180 250, 180 220, 165 210 C150 200, 140 210, 145 230" />
        <path d="M170 300V260 C170 240, 190 240, 190 260 C190 280, 200 280, 200 260 V250" />
        <path d="M110 300V280 C110 260, 100 260, 100 280 C90 300, 80 300, 80 280 C80 260, 70 270, 70 290 V300 Z" />
        <path d="M125 225 c -15 -5, -25 -20, -20 -35 c 5 -15, 20 -25, 35 -20" />
        <path d="M165 215 c 15 -5, 25 -20, 20 -35 c -5 -15, -20 -25, -35 -20" />
        <path d="M80 280 c -20 0, -30 -15, -20 -30 c 10 -15, 25 -10, 30 5" />
    </svg>
);

export default CoralLeft;
