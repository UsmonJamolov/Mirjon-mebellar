"use client";

/**
 * Premium Eames-style lounge chair — SVG illustration.
 * Stable, transparent background, matches reference design.
 */
export function EamesChair({
  leatherColor = "#f1ead8",
  woodColor = "#7a4a26",
  baseColor = "#1a1a1a",
}: {
  leatherColor?: string;
  woodColor?: string;
  baseColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 480"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="leather-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={leatherColor} />
          <stop offset="50%" stopColor={leatherColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="leather-grad-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.18" />
          <stop offset="35%" stopColor={leatherColor} stopOpacity="0.92" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="wood-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={woodColor} />
          <stop offset="100%" stopColor="#3a1f0e" />
        </linearGradient>
        <linearGradient id="base-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={baseColor} />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <radialGradient id="cushion-light" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floor reflection */}
      <ellipse
        cx="200"
        cy="455"
        rx="120"
        ry="10"
        fill="#000"
        opacity="0.22"
        filter="url(#shadow-blur)"
      />

      {/* Wood shell — back (visible behind head + main cushion) */}
      <path
        d="M88 130
           Q92 60 200 50
           Q308 60 312 130
           L308 290
           Q295 308 270 305
           L130 305
           Q105 308 92 290
           Z"
        fill="url(#wood-grad)"
      />
      {/* Wood shell — soft inner shadow */}
      <path
        d="M105 135
           Q108 78 200 70
           Q292 78 295 135
           L292 270
           Q280 282 260 280
           L140 280
           Q120 282 108 270
           Z"
        fill="#5a3219"
        opacity="0.55"
      />

      {/* Headrest cushion */}
      <ellipse
        cx="200"
        cy="135"
        rx="92"
        ry="42"
        fill="url(#leather-grad)"
      />
      <ellipse cx="200" cy="125" rx="80" ry="28" fill="url(#cushion-light)" />
      {/* Headrest tufting line */}
      <path
        d="M150 138 Q200 150 250 138"
        stroke="#000"
        strokeOpacity="0.12"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Back cushion */}
      <path
        d="M100 190
           Q100 175 118 172
           L282 172
           Q300 175 300 190
           L300 290
           Q300 308 282 312
           L118 312
           Q100 308 100 290
           Z"
        fill="url(#leather-grad)"
      />
      {/* Cushion tufting buttons */}
      {[
        [155, 215],
        [200, 215],
        [245, 215],
        [155, 260],
        [200, 260],
        [245, 260],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="2.4" fill="#000" opacity="0.18" />
          <circle cx={x - 0.5} cy={y - 0.5} r="1" fill="#fff" opacity="0.45" />
        </g>
      ))}
      {/* Back cushion vertical seam */}
      <line
        x1="200"
        y1="180"
        x2="200"
        y2="305"
        stroke="#000"
        strokeOpacity="0.06"
        strokeWidth="1"
      />

      {/* Left armrest */}
      <path
        d="M62 215
           Q58 200 78 196
           L120 196
           Q132 198 132 212
           L132 290
           Q132 308 118 312
           L82 312
           Q62 308 62 290
           Z"
        fill="url(#wood-grad)"
      />
      <ellipse cx="97" cy="220" rx="32" ry="12" fill={leatherColor} opacity="0.92" />

      {/* Right armrest */}
      <path
        d="M338 215
           Q342 200 322 196
           L280 196
           Q268 198 268 212
           L268 290
           Q268 308 282 312
           L318 312
           Q338 308 338 290
           Z"
        fill="url(#wood-grad)"
      />
      <ellipse cx="303" cy="220" rx="32" ry="12" fill={leatherColor} opacity="0.92" />

      {/* Seat cushion (front, slightly visible) */}
      <ellipse cx="200" cy="320" rx="115" ry="20" fill="url(#leather-grad-side)" />

      {/* Center post */}
      <rect
        x="194"
        y="332"
        width="12"
        height="58"
        rx="3"
        fill="url(#base-grad)"
      />

      {/* 5-star base */}
      <g transform="translate(200 410)">
        {/* Center hub */}
        <ellipse cx="0" cy="0" rx="22" ry="9" fill="url(#base-grad)" />

        {/* 5 legs radiating */}
        {[
          { angle: -90, len: 0 }, // hidden behind
          { angle: -36, len: 95 },
          { angle: 36, len: 95 },
          { angle: -150, len: 90 },
          { angle: 150, len: 90 },
        ]
          .filter((leg) => leg.len > 0)
          .map((leg, i) => {
            const rad = (leg.angle * Math.PI) / 180;
            const x = Math.cos(rad) * leg.len;
            const y = Math.sin(rad) * leg.len * 0.32; // perspective compression
            return (
              <g key={i}>
                <path
                  d={`M -8 0 L ${x - 4} ${y - 2} Q ${x + 2} ${y} ${x + 2} ${y + 4} L 6 6 Z`}
                  fill="url(#base-grad)"
                />
                {/* foot cap */}
                <circle
                  cx={x + 1}
                  cy={y + 4}
                  r="3.5"
                  fill="#0a0a0a"
                />
              </g>
            );
          })}

        {/* Front center leg */}
        <path
          d="M -7 4 L -4 28 Q 0 32 4 28 L 7 4 Z"
          fill="url(#base-grad)"
        />
        <circle cx="0" cy="30" r="4" fill="#0a0a0a" />
      </g>

      {/* Soft highlights */}
      <ellipse
        cx="160"
        cy="200"
        rx="28"
        ry="8"
        fill="#fff"
        opacity="0.18"
      />
    </svg>
  );
}
