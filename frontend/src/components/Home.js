import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
  }),
};

const letterVariants = {
  visible: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    rotateY: 90,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

const imageVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: -100 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      bounce: 0.5, 
      duration: 1.5 
    }
  },
};

const Home = () => {
  const title = "MONOPOLY";

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          overflow: "hidden"
        }}
      >
        {/* --- ANIMATED TEXT SECTION --- */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          
          {/* 1. The Main Title */}
          <motion.div
            style={{ 
                display: "flex", 
                flexWrap: "wrap", // Allows wrapping if screen is extremely small
                justifyContent: "center" 
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {title.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                <Typography
                  component="h1"
                  // FIX: Use 'sx' breakpoints to resize font based on screen width
                  sx={{
                    fontWeight: 900,
                    // Mobile: 2.5rem, Tablet: 3.5rem, Desktop: 3.75rem (h2 size)
                    fontSize: { xs: "2.3rem", sm: "3.5rem", md: "3.75rem" }, 
                    // Mobile: Tight spacing, Desktop: Wide spacing
                    letterSpacing: { xs: "0.05rem", md: "0.2rem" }, 
                    color: "#333",
                    textShadow: "2px 2px 0px #FFD700",
                    lineHeight: 1, // Prevents large vertical gaps
                  }}
                >
                  {char}
                </Typography>
              </motion.span>
            ))}
          </motion.div>

          {/* 2. The Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontStyle: "italic",
                color: "gray",
                marginTop: 1,
                // FIX: Reduce letter spacing on mobile so "NTU Sunflower" fits
                letterSpacing: { xs: 1, md: 3 }, 
                fontSize: { xs: "1rem", md: "1.25rem" },
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
               NTU Sunflower
            </Typography>
          </motion.div>
        </Box>

        {/* --- ANIMATED IMAGE SECTION --- */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "20px",
              boxShadow: "0px 20px 50px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            <img
              src="/mainPage.jpg"
              alt="Monopoly Main Board"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                userSelect: "none",
              }}
            />
          </motion.div>
        </motion.div>

      </Box>
    </Container>
  );
};

export default Home;