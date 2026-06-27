import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * "Alohomora" — Hogwarts gates intro.
 * A full-screen overlay: a glowing keyhole-seal, the great gates rattle then
 * swing open in 3D as golden light spills through, finally fading to reveal
 * the home page. Plays on every home visit. Tap anywhere to skip.
 *
 * UX guarantees: interruptible (tap to skip), respects prefers-reduced-motion
 * (collapses to a quick fade), and animates transform/opacity only for 60fps.
 */

const GOLD = "#D7B765";
const GOLD_BRIGHT = "#F0D48A";

// Timeline (ms)
const T_OPEN = 1050; // gates begin to swing
const T_FADE = 2550; // overlay begins to fade away
const T_DONE = 3200; // unmount

// Wrought-iron gate face: vertical bars + gold sheen.
const gateFace = {
  backgroundColor: "#0a0f17",
  backgroundImage: [
    // vertical iron bars with a gold edge highlight
    "repeating-linear-gradient(90deg, #0a0f17 0px, #0a0f17 40px, #241b0e 40px 42px, #c6a65a 42px 48px, #6f5526 48px 50px, #241b0e 50px 52px)",
    // soft top-down stone shading
    "linear-gradient(180deg, rgba(22,33,52,0.85) 0%, rgba(7,11,18,0.95) 100%)",
  ].join(","),
  backgroundBlendMode: "overlay, normal",
};

const Rail = ({ top }) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      left: 0,
      right: 0,
      top,
      height: 16,
      background:
        "linear-gradient(180deg, #f0d48a 0%, #c6a65a 45%, #6f5526 100%)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)",
      // stud rivets
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(60,44,16,0.9) 0 2px, transparent 2.5px)",
        backgroundSize: "52px 16px",
        backgroundPosition: "21px center",
      },
    }}
  />
);

// ── Harry Potter emblems ───────────────────────────────────────────────────

const DeathlyHallows = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
    <polygon points="50,12 88,84 12,84" stroke={GOLD_BRIGHT} strokeWidth="3.5"
      fill="none" strokeLinejoin="round" />
    <circle cx="50" cy="58" r="23" stroke={GOLD_BRIGHT} strokeWidth="3.5" fill="none" />
    <line x1="50" y1="12" x2="50" y2="84" stroke={GOLD_BRIGHT} strokeWidth="3.5" />
  </svg>
);

const Snitch = ({ size = 60 }) => (
  <svg width={size} height={size * 0.66} viewBox="0 0 120 80" fill="none" aria-hidden>
    <path d="M60 42 C 40 18, 16 16, 4 30 C 20 30, 36 35, 60 46 Z"
      fill="rgba(240,212,138,0.9)" stroke="#A9842F" strokeWidth="1" />
    <path d="M60 42 C 80 18, 104 16, 116 30 C 100 30, 84 35, 60 46 Z"
      fill="rgba(240,212,138,0.9)" stroke="#A9842F" strokeWidth="1" />
    <path d="M14 28 L 40 38 M 16 33 L 42 41" stroke="rgba(122,90,24,0.5)" strokeWidth="0.8" />
    <path d="M106 28 L 80 38 M 104 33 L 78 41" stroke="rgba(122,90,24,0.5)" strokeWidth="0.8" />
    <circle cx="60" cy="48" r="13" fill="url(#snitchBody)" stroke="#7A5A18" strokeWidth="1.2" />
    <path d="M48 48 H72 M60 36 V60" stroke="rgba(122,90,24,0.7)" strokeWidth="0.9" />
    <circle cx="56" cy="44" r="2.4" fill="rgba(255,255,255,0.85)" />
    <defs>
      <radialGradient id="snitchBody" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stopColor="#FFF4CC" />
        <stop offset="55%" stopColor="#D7B765" />
        <stop offset="100%" stopColor="#A9842F" />
      </radialGradient>
    </defs>
  </svg>
);

// Gilded spike finials running along the top of a gate leaf.
const Finials = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 18,
      background:
        "linear-gradient(180deg, #f7e6b0 0%, #f0d48a 30%, #c6a65a 65%, #6f5526 100%)",
      clipPath:
        "polygon(0 100%,5% 0,10% 100%,15% 0,20% 100%,25% 0,30% 100%,35% 0,40% 100%,45% 0,50% 100%,55% 0,60% 100%,65% 0,70% 100%,75% 0,80% 100%,85% 0,90% 100%,95% 0,100% 100%)",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
    }}
  />
);

// Symmetric scrollwork flourish.
const Filigree = ({ top }) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top,
      left: "50%",
      transform: "translateX(-50%)",
      width: "72%",
      maxWidth: 230,
      opacity: 0.85,
    }}
  >
    <svg viewBox="0 0 200 26" width="100%" fill="none" aria-hidden>
      <path
        d="M100 13 C 72 0, 44 2, 12 12 C 44 8, 72 16, 100 13 C 128 16, 156 8, 188 12 C 156 2, 128 0, 100 13 Z"
        stroke="#c6a65a"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="13" r="3.2" fill={GOLD_BRIGHT} />
      <circle cx="12" cy="12" r="2" fill="#c6a65a" />
      <circle cx="188" cy="12" r="2" fill="#c6a65a" />
    </svg>
  </Box>
);

// Round embossed medallion holding an emblem.
const Medallion = ({ top, children }) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top,
      left: "50%",
      transform: "translateX(-50%)",
      width: 96,
      height: 96,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 35% 28%, #1b2a3e 0%, #0a0f17 75%)",
      border: "3px solid #c6a65a",
      boxShadow:
        "0 0 20px rgba(240,212,138,0.45), inset 0 0 22px rgba(0,0,0,0.8), inset 0 0 2px rgba(240,212,138,0.6)",
    }}
  >
    {children}
  </Box>
);

// One side of the gate.
const GateLeaf = ({ side, open, reduced }) => {
  const isLeft = side === "left";
  return (
    <motion.div
      aria-hidden
      initial={{ rotateY: 0 }}
      animate={
        reduced
          ? { rotateY: 0 }
          : { rotateY: open ? (isLeft ? -115 : 115) : [0, isLeft ? -2.5 : 2.5, 0] }
      }
      transition={
        open
          ? { duration: 1.45, ease: [0.7, 0, 0.3, 1] }
          : { duration: 0.5, repeat: open ? 0 : 1, ease: "easeInOut" } // rattle
      }
      style={{
        position: "relative",
        width: "50%",
        height: "100%",
        transformOrigin: isLeft ? "left center" : "right center",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, ...gateFace }} />
      <Rail top="22%" />
      <Rail top="70%" />

      {/* Gilded finials + scrollwork crown */}
      <Finials />
      <Filigree top="9%" />

      {/* Central HP emblem: Deathly Hallows (left) · Golden Snitch (right) */}
      <Medallion top="40%">
        {isLeft ? <DeathlyHallows /> : <Snitch />}
      </Medallion>

      {/* Lower scrollwork echo */}
      <Filigree top="84%" />

      {/* Ornate gold pillar along the meeting edge */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [isLeft ? "right" : "left"]: 0,
          width: 12,
          background:
            "linear-gradient(90deg, #6f5526, #f0d48a 45%, #c6a65a 60%, #6f5526)",
          boxShadow: `0 0 18px rgba(240,212,138,0.55)`,
        }}
      />

      {/* inner shadow to add depth */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.75)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
};

// Drifting golden dust mote.
const Dust = ({ left, delay, dur, size }) => (
  <motion.span
    aria-hidden
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: [0, 0.9, 0], y: -120 }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: "easeOut" }}
    style={{
      position: "absolute",
      bottom: "30%",
      left,
      width: size,
      height: size,
      borderRadius: "50%",
      background: GOLD_BRIGHT,
      boxShadow: `0 0 8px 2px rgba(240,212,138,0.8)`,
    }}
  />
);

const HogwartsGatesIntro = ({ onFinish }) => {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [finished, setFinished] = useState(false);

  const finish = useCallback(() => {
    if (finished) return;
    setFinished(true);
    setVisible(false);
    // allow exit fade to play before unmount
    setTimeout(onFinish, 450);
  }, [finished, onFinish]);

  useEffect(() => {
    if (reduced) {
      // Motion-sensitive users: skip the cinematic, just hand off quickly.
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setOpen(true), T_OPEN);
    const t2 = setTimeout(() => setVisible(false), T_FADE);
    const t3 = setTimeout(() => {
      setFinished(true);
      onFinish();
    }, T_DONE);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gates"
          role="presentation"
          aria-label="Opening the gates of Hogwarts"
          onClick={finish}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 4000,
            overflow: "hidden",
            background: "#05080d",
            perspective: "1500px",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {/* Golden light bloom behind the gates (flex-centered so the
              scale animation can't override the centering transform) */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0.15, scale: 0.6 }}
              animate={{
                opacity: open ? [0.3, 1, 0.85] : 0.25,
                scale: open ? [0.7, 1.6, 2.2] : 0.7,
              }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              style={{
                width: "70vw",
                height: "70vw",
                background:
                  "radial-gradient(circle, rgba(255,244,204,0.95) 0%, rgba(240,212,138,0.55) 28%, rgba(215,183,101,0.15) 55%, transparent 72%)",
              }}
            />
          </Box>

          {/* The two gate leaves */}
          <Box sx={{ position: "absolute", inset: 0, display: "flex" }}>
            <GateLeaf side="left" open={open} reduced={reduced} />
            <GateLeaf side="right" open={open} reduced={reduced} />
          </Box>

          {/* Center keyhole seal + caption (flex-centered; the inner motion
              div only scales/fades so centering is never overridden) */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 5,
            }}
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: open ? 0 : 1,
              scale: open ? 1.4 : [0.7, 1, 1.04, 1],
            }}
            transition={{ duration: open ? 0.5 : 1, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Glowing keyhole */}
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 6px rgba(240,212,138,0.7))",
                  "drop-shadow(0 0 18px rgba(240,212,138,1))",
                  "drop-shadow(0 0 6px rgba(240,212,138,0.7))",
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="74" height="92" viewBox="0 0 74 92" fill="none" aria-hidden>
                <circle cx="37" cy="40" r="34" stroke={GOLD} strokeWidth="3"
                  fill="rgba(8,12,18,0.55)" />
                <circle cx="37" cy="40" r="29" stroke="rgba(240,212,138,0.5)" strokeWidth="1" fill="none" />
                {/* keyhole */}
                <circle cx="37" cy="34" r="9" fill={GOLD_BRIGHT} />
                <path d="M 31 40 L 43 40 L 46 60 L 28 60 Z" fill={GOLD_BRIGHT} />
                {/* little ornaments */}
                <circle cx="37" cy="6" r="3" fill={GOLD} />
                <circle cx="37" cy="74" r="3" fill={GOLD} />
              </svg>
            </motion.div>

            <Typography
              sx={{
                mt: 2,
                fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.9rem" },
                letterSpacing: "0.18em",
                color: GOLD_BRIGHT,
                textShadow: "0 0 14px rgba(240,212,138,0.7)",
              }}
            >
              ALOHOMORA
            </Typography>
          </motion.div>
          </Box>

          {/* Drifting dust */}
          {!reduced && (
            <Box aria-hidden sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <Dust left="18%" delay={0} dur={2.6} size={4} />
              <Dust left="38%" delay={0.7} dur={3} size={3} />
              <Dust left="58%" delay={1.1} dur={2.4} size={5} />
              <Dust left="78%" delay={0.4} dur={2.8} size={3} />
            </Box>
          )}

          {/* Skip hint */}
          <Typography
            sx={{
              position: "absolute",
              bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "rgba(215,183,101,0.6)",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            Tap to skip
          </Typography>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HogwartsGatesIntro;
