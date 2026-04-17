import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const SaleNeonIcon = (props: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" strokeWidth="1" />
  </svg>
);

export const WithdrawalNeonIcon = (props: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    <path d="M17 7l5-5M17 2h5v5" strokeWidth="2" />
  </svg>
);

export const RewardNeonIcon = (props: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <circle cx="12" cy="19" r="2" fill="currentColor" />
  </svg>
);

export const RefundNeonIcon = (props: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" strokeWidth="1.5" />
  </svg>
);

export const ExpenseNeonIcon = (props: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" strokeWidth="3" opacity="0.5" />
    <circle cx="18" cy="15" r="1" fill="currentColor" />
    <path d="M7 15h4" strokeWidth="2" />
  </svg>
);
