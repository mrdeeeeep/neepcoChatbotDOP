import React, { useId, useMemo } from 'react';

type Props = React.SVGProps<SVGSVGElement> & { className?: string };

export const VectorBlob: React.FC<Props> = ({ className = '', ...rest }) => {
  // Stable, unique gradient id per instance (safe for multiple copies)
  const rawId = useId();
  const gradId = useMemo(
    () => `heroGradient-${String(rawId).replace(/:/g, '')}`,
    [rawId]
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 2123 2051"
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none select-none ${className}`}
      {...rest}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="-765.041"
          y1="208.27"
          x2="1226.03"
          y2="1813.53"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#E5312D" />
          <stop offset="0.505208" stopColor="#B63633" />
          <stop offset="1" stopColor="#3570BD" />
        </linearGradient>
      </defs>

      {/* Use only the gradient-filled shape. 
          If you want the black underlay from your file, 
          add a duplicate path below with fill="black" and a low opacity. */}
      <path
        d="M52.0967 690.671C-33.917 591.092 7.06003 506.435 38.3002 476.555L482.885 0.0979033L2122.29 1529.84L1677.71 2006.3C1650.06 2039.53 1568.44 2086.26 1463.15 2007.33C1331.54 1908.68 1292.62 1956.88 1240.17 1976.37C1187.73 1995.86 1124.52 2005.3 1049.3 1880.77C974.07 1756.24 882.93 1653.08 742.21 1650.57C629.633 1648.56 564.586 1599.54 542.81 1579.22C521.034 1558.9 467.631 1497.4 457.844 1385.23C445.611 1245.02 336.402 1161.23 206.971 1094.79C77.5397 1028.35 82.5863 964.637 98.4043 910.974C114.222 857.312 159.614 815.145 52.0967 690.671Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
};
