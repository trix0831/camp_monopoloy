import React from "react";
import { Box } from "@mui/material";

/**
 * MagicSpinner — a Harry-Potter-styled loading indicator.
 *
 * A revolving golden rune-ring with a twinkling wand-spark at its centre,
 * evoking a spell being cast. Sized to sit inside a button or stand alone.
 * Respects `prefers-reduced-motion`.
 *
 * Props:
 *   size  – diameter in px (default 26)
 *   color – ring colour (default "currentColor", so it inherits the button
 *           text colour — dark bronze on the gold contained buttons).
 */
const MagicSpinner = ({ size = 26, color = "currentColor" }) => {
  return (
    <Box
      role="status"
      aria-label="Casting…"
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        // Honour users who prefer reduced motion.
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" },
        },
      }}
    >
      {/* Revolving rune-ring */}
      <Box
        component="svg"
        viewBox="0 0 50 50"
        sx={{
          width: "100%",
          height: "100%",
          animation: "msSpin 1.1s linear infinite",
          filter: "drop-shadow(0 0 2px rgba(240,212,138,0.55))",
          "@keyframes msSpin": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
          },
        }}
      >
        {/* faint full rune-ring */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeOpacity="0.28"
          strokeWidth="3"
          strokeDasharray="2 5"
          strokeLinecap="round"
        />
        {/* bright sweeping arc — the active part of the spell */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="34 200"
        />
      </Box>

      {/* Twinkling wand-spark at the centre */}
      <Box
        component="svg"
        viewBox="0 0 50 50"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          animation: "msTwinkle 1.1s ease-in-out infinite",
          "@keyframes msTwinkle": {
            "0%, 100%": { opacity: 0.35, transform: "scale(0.7)" },
            "50%": { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        <path
          d="M25 15 L26.7 23.3 L35 25 L26.7 26.7 L25 35 L23.3 26.7 L15 25 L23.3 23.3 Z"
          fill="#F0D48A"
        />
      </Box>
    </Box>
  );
};

export default MagicSpinner;
