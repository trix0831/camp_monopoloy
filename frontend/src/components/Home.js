import React, { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import HogwartsGatesIntro from "./HogwartsGatesIntro";
import FlyingBaby from "./FlyingBaby";

// --- Animation Variants ---------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
  }),
};

const letterVariants = {
  visible: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: { type: "spring", damping: 12, stiffness: 200 },
  },
  hidden: {
    opacity: 0,
    y: 24,
    rotateY: 90,
    transition: { type: "spring", damping: 12, stiffness: 200 },
  },
};

const frameVariants = {
  hidden: { opacity: 0, scale: 0.85, y: -60 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.42, duration: 1.4 },
  },
};

const GOLD = "#D7B765";
const GOLD_BRIGHT = "#F0D48A";

// A single sparkling ember that drifts upward like floating candlelight.
const Ember = ({ left, delay, duration, size }) => (
  <motion.span
    aria-hidden
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: [0, 0.9, 0], y: -160 }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    style={{
      position: "absolute",
      bottom: 0,
      left,
      width: size,
      height: size,
      borderRadius: "50%",
      background: GOLD_BRIGHT,
      boxShadow: `0 0 8px 2px rgba(240,212,138,0.8)`,
      pointerEvents: "none",
    }}
  />
);

const Home = () => {
  const title = "MONOPOLY";
  const prefersReduced = useReducedMotion();
  // Plays the Hogwarts-gates intro on every home visit.
  const [showIntro, setShowIntro] = useState(true);
  // The baby takes flight the instant the gates open (out of the light).
  const [gatesOpen, setGatesOpen] = useState(false);

  return (
    <Container component="main" maxWidth="sm">
      {showIntro && (
        <HogwartsGatesIntro
          onGatesOpen={() => setGatesOpen(true)}
          onFinish={() => setShowIntro(false)}
        />
      )}

      {/* Flying wizard baby — soars out of the gate-light, then roams wide.
          Fixed full-screen layer (above the intro) so nothing clips her. */}
      {(gatesOpen || !showIntro) && <FlyingBaby />}
      <Box
        sx={{
          position: "relative",
          marginTop: { xs: 13, md: 15 },
          minHeight: "72vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: { xs: 5, md: 6 },
          px: { xs: 1.5, sm: 0 },
          overflow: "hidden",
        }}
      >
        {/* Drifting candlelight embers (decorative) */}
        {!prefersReduced && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <Ember left="12%" delay={0} duration={6} size={4} />
            <Ember left="28%" delay={1.6} duration={7.5} size={3} />
            <Ember left="48%" delay={0.8} duration={6.8} size={5} />
            <Ember left="66%" delay={2.2} duration={7} size={3} />
            <Ember left="83%" delay={1.1} duration={8} size={4} />
          </Box>
        )}

        {/* --- ANIMATED TITLE --- */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {title.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
                    fontWeight: 900,
                    fontSize: { xs: "2rem", sm: "3rem", md: "3.4rem" },
                    letterSpacing: { xs: "0.04rem", md: "0.12rem" },
                    color: "#F4ECD6",
                    lineHeight: 1.05,
                    px: char === " " ? "0.28em" : 0,
                    backgroundImage: `linear-gradient(180deg, ${GOLD_BRIGHT} 0%, ${GOLD} 55%, #A9842F 100%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 16px rgba(215,183,101,0.35)",
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.5))",
                  }}
                >
                  {char === " " ? " " : char}
                </Typography>
              </motion.span>
            ))}
          </motion.div>

          {/* Decorative rule with a central spark */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
            style={{ width: "70%", maxWidth: 280, marginTop: 10 }}
          >
            <Box
              sx={{
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                position: "relative",
                "&::after": {
                  content: '"✦"',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: GOLD_BRIGHT,
                  fontSize: "0.8rem",
                  textShadow: `0 0 8px ${GOLD_BRIGHT}`,
                },
              }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.9 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Cinzel', serif",
                color: GOLD_BRIGHT,
                marginTop: 1.4,
                letterSpacing: { xs: "0.18em", md: "0.3em" },
                fontSize: { xs: "0.85rem", md: "1rem" },
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              NTU&nbsp;Sunflower&nbsp;Camp
            </Typography>
            <Typography
              sx={{
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic",
                color: "rgba(199,188,160,0.9)",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                textAlign: "center",
                mt: 0.3,
              }}
            >
              06&nbsp;–&nbsp;09 July 2026 · @金美國小
            </Typography>
          </motion.div>
        </Box>

        {/* --- HERO POSTER IN ENCHANTED GOLD FRAME --- */}
        <motion.div
          variants={frameVariants}
          initial="hidden"
          animate="visible"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <motion.div
            animate={prefersReduced ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "100%", maxWidth: 420 }}
          >
            <Box
              sx={{
                position: "relative",
                p: { xs: "10px", sm: "14px" },
                borderRadius: "18px",
                background:
                  "linear-gradient(145deg, #F0D48A 0%, #D7B765 35%, #8C6A22 70%, #D7B765 100%)",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.4), 0 18px 50px rgba(0,0,0,0.55), 0 0 60px rgba(215,183,101,0.30)",
              }}
            >
              {/* inner dark mat */}
              <Box
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.45)",
                  boxShadow: "inset 0 0 24px rgba(0,0,0,0.6)",
                }}
              >
                <Box
                  component="img"
                  src="/GoldBeauty.jpg"
                  alt="NTU Sunflower Camp — Harry Potter themed poster with castle and golden snitch"
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    userSelect: "none",
                  }}
                />
              </Box>

              {/* Corner flourishes */}
              {[
                { top: 4, left: 6 },
                { top: 4, right: 6 },
                { bottom: 4, left: 6 },
                { bottom: 4, right: 6 },
              ].map((pos, i) => (
                <Box
                  key={i}
                  aria-hidden
                  sx={{
                    position: "absolute",
                    ...pos,
                    color: "#5A4313",
                    fontSize: "1rem",
                    lineHeight: 1,
                    opacity: 0.8,
                  }}
                >
                  ✦
                </Box>
              ))}
            </Box>
          </motion.div>
        </motion.div>

        {/* Footnote spell */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          style={{ zIndex: 1 }}
        >
          <Typography
            sx={{
              fontFamily: "'Cinzel', serif",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              letterSpacing: "0.2em",
              color: "rgba(215,183,101,0.7)",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            ⚡ Let the magic begin ⚡
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Home;
