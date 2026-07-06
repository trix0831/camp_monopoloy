import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

/**
 * Flying wizard baby mascot — a fixed, full-screen layer.
 *
 * Plan A (entrance): the instant the Hogwarts gates swing open, she is born
 * from the central gate-light — a tiny bright spark at screen-center that
 * spins up to full size and flies outward…
 * Plan B (idle): …then roams a wide, viewport-spanning orbit forever, banking
 * gently into the turns.
 * Plus: tap (or Enter/Space) to make her giggle with a squash-and-stretch
 * bounce and a burst of golden sparkles.
 *
 * UX guarantees: transform/opacity only (60fps), respects
 * prefers-reduced-motion (collapses to a static perch), the giggle runs on a
 * separate transform layer so it never disturbs the flight loop, and the
 * overlay is pointer-transparent except for the baby herself.
 */

const GOLD_BRIGHT = "#F0D48A";
const ASPECT = 2256 / 1888; // intrinsic height / width of the cutout

// A wide, closed, meandering flight loop in normalized [-1, 1] space, scaled
// to the viewport at runtime.
const UNIT = [
  [0, -0.72], [0.82, -0.5], [1, 0.08], [0.7, 0.72],
  [0, 1], [-0.7, 0.72], [-1, 0.08], [-0.82, -0.5], [0, -0.72],
];
const BANKING = [-10, -5, 7, 14, 5, -7, -14, -7, -10];

const buildPath = (ax, ay) => ({
  x: UNIT.map(([x]) => Math.round(x * ax)),
  y: UNIT.map(([, y]) => Math.round(y * ay)),
  rotate: BANKING,
});

// A radial puff of golden sparkles, emitted on each giggle.
const SparkleBurst = () => {
  const n = 8;
  return Array.from({ length: n }).map((_, i) => {
    const angle = (i / n) * Math.PI * 2;
    const dist = 62 + (i % 3) * 16;
    return (
      <motion.span
        key={i}
        aria-hidden
        initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
        animate={{
          opacity: [0, 1, 0],
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: [0.4, 1, 0.5],
        }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          width: 9,
          height: 9,
          marginLeft: -4.5,
          borderRadius: "50%",
          background: GOLD_BRIGHT,
          boxShadow: "0 0 9px 3px rgba(240,212,138,0.9)",
          pointerEvents: "none",
        }}
      />
    );
  });
};

const FlyingBaby = () => {
  const reduced = useReducedMotion();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const flight = useAnimationControls(); // outer layer: travel + banking
  const giggle = useAnimationControls(); // inner layer: squash & stretch
  const [bursts, setBursts] = useState([]);
  const burstId = useRef(0);

  // Capture the viewport once to size the orbit amplitude.
  const [vp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  const width = isSmall ? 130 : 190;
  const height = Math.round(width * ASPECT);
  const ax = Math.min(vp.w * 0.34, 380);
  const ay = Math.min(vp.h * 0.28, 300);
  const path = buildPath(ax, ay);

  // Entrance (out of the light) → wide orbit choreography.
  useEffect(() => {
    if (reduced) {
      flight.set({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
      return;
    }
    let active = true;
    // Born as a bright spark at screen-center, tiny and spinning.
    flight.set({ x: 0, y: 0, rotate: -400, scale: 0.12, opacity: 0 });
    (async () => {
      // Plan A — flare out of the light and spin up to full size.
      await flight.start({
        x: path.x[0],
        y: path.y[0],
        rotate: path.rotate[0],
        scale: 1,
        opacity: 1,
        transition: {
          duration: 1.9,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.5, ease: "easeOut" },
        },
      });
      if (!active) return;
      // Plan B — perpetual wide orbit.
      flight.start({
        x: path.x,
        y: path.y,
        rotate: path.rotate,
        transition: {
          duration: isSmall ? 18 : 24,
          ease: "easeInOut",
          repeat: Infinity,
        },
      });
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, isSmall]);

  const play = useCallback(() => {
    // Squash & stretch giggle (toned down for reduced motion).
    giggle.start(
      reduced
        ? { scale: [1, 1.06, 1], transition: { duration: 0.4 } }
        : {
            scale: [1, 1.2, 0.9, 1.08, 1],
            rotate: [0, -7, 7, -3, 0],
            transition: { duration: 0.6, ease: "easeOut" },
          }
    );
    // Sparkle puff.
    const id = burstId.current++;
    setBursts((b) => [...b, id]);
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 800);
  }, [giggle, reduced]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      play();
    }
  };

  // Anchor: screen-center for the flight (orbit offsets from here); reduced
  // motion perches her quietly in the top-right instead.
  const anchorStyle = reduced
    ? { position: "fixed", top: 80, right: 16, width, zIndex: 4500 }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        marginLeft: -width / 2,
        marginTop: -height / 2,
        width,
        zIndex: 4500,
      };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 4500,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <motion.div animate={flight} style={anchorStyle}>
        <motion.div
          animate={giggle}
          style={{ width: "100%", transformOrigin: "50% 72%" }}
        >
          <Box
            role="button"
            tabIndex={0}
            aria-label="Baby wizard mascot — tap to make her giggle"
            onClick={play}
            onKeyDown={onKeyDown}
            sx={{
              position: "relative",
              pointerEvents: "auto",
              cursor: "pointer",
              outline: "none",
              "&:focus-visible img": {
                filter:
                  "drop-shadow(0 0 0 2px rgba(240,212,138,0.9)) drop-shadow(0 8px 16px rgba(0,0,0,0.45))",
              },
            }}
          >
            <Box
              component="img"
              src="/baby-removebg.png"
              alt=""
              draggable={false}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                userSelect: "none",
                filter:
                  "drop-shadow(0 10px 18px rgba(0,0,0,0.45)) drop-shadow(0 0 16px rgba(240,212,138,0.4))",
              }}
            />

            {/* Twinkling motes off the wizard hat */}
            {!reduced &&
              [
                { left: "68%", top: "8%", d: 0 },
                { left: "82%", top: "20%", d: 0.8 },
              ].map((s, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 2.2,
                    delay: s.d,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    left: s.left,
                    top: s.top,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: GOLD_BRIGHT,
                    boxShadow: "0 0 8px 2px rgba(240,212,138,0.85)",
                    pointerEvents: "none",
                  }}
                />
              ))}

            {/* Giggle sparkle bursts */}
            {bursts.map((id) => (
              <SparkleBurst key={id} />
            ))}
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default FlyingBaby;
