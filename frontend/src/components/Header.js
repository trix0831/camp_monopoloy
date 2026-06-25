import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NavBar from "./NavBar/NavBar";
import RoleContext from "./useRole";
import axios from "./axios";

// ── Keyframes ─────────────────────────────────────────────────────────────────

const bodyFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-1deg); }
  40%       { transform: translateY(-7px) rotate(1.5deg); }
  70%       { transform: translateY(3px)  rotate(-0.5deg); }
`;

const wingFlapUp = keyframes`
  0%   { transform: rotate(-30deg) scaleY(1); }
  50%  { transform: rotate(20deg)  scaleY(0.55); }
  100% { transform: rotate(-30deg) scaleY(1); }
`;

const wingFlapDown = keyframes`
  0%   { transform: rotate(30deg)  scaleY(1); }
  50%  { transform: rotate(-20deg) scaleY(0.55); }
  100% { transform: rotate(30deg)  scaleY(1); }
`;

const eyeBlink = keyframes`
  0%, 92%, 100% { transform: scaleY(1); }
  95%           { transform: scaleY(0.08); }
`;

const featherShimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 1; }
`;

const sparkFloat = keyframes`
  0%   { opacity: 0;   transform: translate(0, 0)    scale(0.4); }
  40%  { opacity: 1;   transform: translate(var(--sx), var(--sy)) scale(1.1); }
  100% { opacity: 0;   transform: translate(var(--sx2), var(--sy2)) scale(0.3); }
`;

const shimmerText = keyframes`
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const glowHalo = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%       { opacity: 0.65; transform: scale(1.12); }
`;

// ── Sparkle particles ─────────────────────────────────────────────────────────

const SPARKS = [
  { sx: "-18px", sy: "-22px", sx2: "-32px", sy2: "-40px", delay: 0,    dur: 2.4 },
  { sx: "20px",  sy: "-18px", sx2: "36px",  sy2: "-34px", delay: 0.6,  dur: 2.8 },
  { sx: "-24px", sy: "10px",  sx2: "-40px", sy2: "22px",  delay: 1.1,  dur: 2.2 },
  { sx: "16px",  sy: "14px",  sx2: "28px",  sy2: "28px",  delay: 1.7,  dur: 3.0 },
  { sx: "0px",   sy: "-28px", sx2: "0px",   sy2: "-48px", delay: 0.3,  dur: 2.6 },
  { sx: "-10px", sy: "20px",  sx2: "-18px", sy2: "36px",  delay: 2.0,  dur: 2.0 },
];

const Spark = ({ sx, sy, sx2, sy2, delay, dur }) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top: "40%",
      left: "50%",
      width: 5,
      height: 5,
      pointerEvents: "none",
      "--sx": sx, "--sy": sy, "--sx2": sx2, "--sy2": sy2,
      animation: `${sparkFloat} ${dur}s ease-out infinite`,
      animationDelay: `${delay}s`,
      "&::before": {
        content: '"✦"',
        position: "absolute",
        transform: "translate(-50%, -50%)",
        fontSize: "9px",
        color: "#F0D48A",
        textShadow: "0 0 6px #F0D48A, 0 0 12px rgba(215,183,101,0.8)",
      },
    }}
  />
);

// ── Hedwig SVG ────────────────────────────────────────────────────────────────

const Hedwig = ({ onClick }) => (
  <Box
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    role="button"
    tabIndex={0}
    aria-label="Hedwig — go home"
    sx={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      userSelect: "none",
      outline: "none",
      "&:focus-visible": { outline: "2px solid rgba(240,212,138,0.7)", borderRadius: 8 },
    }}
  >
    {/* Glow halo behind owl */}
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        width: 52,
        height: 36,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(240,212,138,0.25) 0%, transparent 70%)",
        animation: `${glowHalo} 3s ease-in-out infinite`,
        pointerEvents: "none",
      }}
    />

    {/* Floating / body motion wrapper */}
    <Box
      aria-hidden
      sx={{ animation: `${bodyFloat} 3.6s ease-in-out infinite`, position: "relative" }}
    >
      {/* Sparkle particles */}
      {SPARKS.map((s, i) => <Spark key={i} {...s} />)}

      {/* ── Hedwig SVG ── */}
      <svg
        width="50"
        height="43"
        viewBox="0 0 62 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* ── Left wing ── */}
        <g style={{
          transformOrigin: "28px 26px",
          animation: `${wingFlapUp} 0.9s ease-in-out infinite`,
        }}>
          {/* Outer primary feathers */}
          <ellipse cx="11" cy="30" rx="12" ry="5" fill="rgba(245,240,225,0.75)"
            transform="rotate(-28 11 30)" />
          {/* Wing body */}
          <ellipse cx="18" cy="24" rx="13" ry="7" fill="rgba(235,228,208,0.85)"
            transform="rotate(-18 18 24)" />
          {/* Wing feather lines */}
          <line x1="10" y1="31" x2="24" y2="22" stroke="rgba(180,165,130,0.5)" strokeWidth="0.8" />
          <line x1="13" y1="34" x2="25" y2="25" stroke="rgba(180,165,130,0.4)" strokeWidth="0.7" />
          {/* Wing shimmer overlay */}
          <ellipse cx="18" cy="24" rx="13" ry="7"
            fill="rgba(255,248,220,0.22)"
            transform="rotate(-18 18 24)"
            style={{ animation: `${featherShimmer} 2.4s ease-in-out infinite` }}
          />
        </g>

        {/* ── Right wing ── */}
        <g style={{
          transformOrigin: "34px 26px",
          animation: `${wingFlapDown} 0.9s ease-in-out infinite`,
        }}>
          <ellipse cx="51" cy="30" rx="12" ry="5" fill="rgba(245,240,225,0.75)"
            transform="rotate(28 51 30)" />
          <ellipse cx="44" cy="24" rx="13" ry="7" fill="rgba(235,228,208,0.85)"
            transform="rotate(18 44 24)" />
          <line x1="52" y1="31" x2="38" y2="22" stroke="rgba(180,165,130,0.5)" strokeWidth="0.8" />
          <line x1="49" y1="34" x2="37" y2="25" stroke="rgba(180,165,130,0.4)" strokeWidth="0.7" />
          <ellipse cx="44" cy="24" rx="13" ry="7"
            fill="rgba(255,248,220,0.22)"
            transform="rotate(18 44 24)"
            style={{ animation: `${featherShimmer} 2.4s ease-in-out infinite`, animationDelay: "0.4s" }}
          />
        </g>

        {/* ── Body ── */}
        <ellipse cx="31" cy="34" rx="10" ry="13" fill="#EDE5CC" />
        {/* Body feather texture */}
        <ellipse cx="31" cy="34" rx="10" ry="13" fill="url(#bodyPattern)" opacity="0.4" />
        {/* Chest white patch */}
        <ellipse cx="31" cy="38" rx="6.5" ry="8" fill="#F8F4E8" />
        {/* Chest markings */}
        <path d="M 28 34 Q 31 36 34 34" stroke="rgba(160,145,110,0.5)" strokeWidth="0.8" fill="none" />
        <path d="M 27 37 Q 31 39 35 37" stroke="rgba(160,145,110,0.4)" strokeWidth="0.7" fill="none" />
        <path d="M 28 40 Q 31 42 34 40" stroke="rgba(160,145,110,0.35)" strokeWidth="0.7" fill="none" />

        {/* ── Head ── */}
        <circle cx="31" cy="22" r="11" fill="#EDE5CC" />
        {/* Head feather texture */}
        <circle cx="31" cy="22" r="11" fill="#F5F0DF" opacity="0.5" />
        {/* Facial disc */}
        <ellipse cx="31" cy="23" rx="8" ry="7.5" fill="#F8F3E2" stroke="rgba(200,185,145,0.6)" strokeWidth="0.7" />
        {/* Top ear tufts */}
        <path d="M 23 14 L 25 9 L 27 14" fill="#D8CEA8" stroke="rgba(180,165,130,0.6)" strokeWidth="0.5" />
        <path d="M 35 14 L 37 9 L 39 14" fill="#D8CEA8" stroke="rgba(180,165,130,0.6)" strokeWidth="0.5" />
        {/* Crown markings */}
        <path d="M 25 16 Q 31 13 37 16" stroke="rgba(160,145,110,0.5)" strokeWidth="0.8" fill="none" />

        {/* ── Eyes ── */}
        {/* Left eye */}
        <circle cx="26" cy="22" r="4" fill="#1A1206" />
        <circle cx="26" cy="22" r="3.2"
          fill="#E8A020"
          style={{ animation: `${eyeBlink} 5s ease-in-out infinite` }}
        />
        <circle cx="26" cy="22" r="1.8" fill="#0A0804" />
        <circle cx="27.2" cy="20.8" r="0.9" fill="rgba(255,255,255,0.85)" />
        {/* Left eye ring */}
        <circle cx="26" cy="22" r="4" stroke="rgba(160,140,90,0.6)" strokeWidth="0.6" fill="none" />

        {/* Right eye */}
        <circle cx="36" cy="22" r="4" fill="#1A1206" />
        <circle cx="36" cy="22" r="3.2"
          fill="#E8A020"
          style={{ animation: `${eyeBlink} 5s ease-in-out infinite`, animationDelay: "0.1s" }}
        />
        <circle cx="36" cy="22" r="1.8" fill="#0A0804" />
        <circle cx="37.2" cy="20.8" r="0.9" fill="rgba(255,255,255,0.85)" />
        <circle cx="36" cy="22" r="4" stroke="rgba(160,140,90,0.6)" strokeWidth="0.6" fill="none" />

        {/* ── Beak ── */}
        <path d="M 29.5 25.5 L 31 28.5 L 32.5 25.5 Q 31 24.5 29.5 25.5 Z"
          fill="#C8A040" stroke="rgba(150,110,30,0.7)" strokeWidth="0.5" />

        {/* ── Talons ── */}
        <path d="M 26 47 L 24 51 M 26 47 L 26 51 M 26 47 L 28 51"
          stroke="#C8A040" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 36 47 L 34 51 M 36 47 L 36 51 M 36 47 L 38 51"
          stroke="#C8A040" strokeWidth="1.2" strokeLinecap="round" />
        {/* Leg stubs */}
        <line x1="28" y1="46" x2="26" y2="47" stroke="#C8A040" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="46" x2="36" y2="47" stroke="#C8A040" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── Golden snitch held in talon (easter egg) ── */}
        <circle cx="31" cy="50" r="2.2" fill="url(#snitchGrad)" />
        <circle cx="30.2" cy="49.2" r="0.6" fill="rgba(255,255,255,0.7)" />

        <defs>
          <radialGradient id="snitchGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFF4CC" />
            <stop offset="50%" stopColor="#D7B765" />
            <stop offset="100%" stopColor="#A9842F" />
          </radialGradient>
          <pattern id="bodyPattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="2" cy="2" r="0.6" fill="rgba(160,145,110,0.35)" />
          </pattern>
        </defs>
      </svg>
    </Box>
  </Box>
);

// ── Header ────────────────────────────────────────────────────────────────────

const Header = () => {
  const [open, setOpen] = useState(false);

  const {
    role,
    setRole,
    setRoleId,
    buildings,
    setBuildings,
    filteredBuildings,
    setFilteredBuildings,
  } = useContext(RoleContext);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleChange = () => setOpen(!open);
  const handleLogin = () => navigate("login");
  const handleLogout = () => {
    setRole("");
    setRoleId(0);
    localStorage.removeItem("role");
    navigate("/");
  };

  const getProperties = async () => {
    await axios
      .get("/land")
      .then((res) => setBuildings(res.data))
      .catch((error) => console.error(error));
    setFilteredBuildings(
      buildings.filter(
        (b) => b.type === "Building" || b.type === "SpecialBuilding"
      )
    );
  };

  useEffect(() => {
    if (buildings.length === 0 || filteredBuildings.length === 0) {
      getProperties();
    }
    const timer = setInterval(() => {}, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBuildings, buildings]);

  return (
    <Grid container>
      <AppBar position="fixed" sticky="top">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: 64, sm: 72 },
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Left: menu */}
          <IconButton
            onClick={handleChange}
            aria-label="Open navigation menu"
            sx={{ color: "#F0D48A", flexShrink: 0 }}
          >
            <MenuIcon />
            <NavBar open={open} />
          </IconButton>

          {/* Center: Hedwig + MONOPOLY side by side */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.5, sm: 1 },
              flex: 1,
              cursor: "pointer",
            }}
          >
            <Hedwig onClick={() => navigate("/")} />

            <Typography
              component="span"
              sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 900,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.3rem" },
                letterSpacing: { xs: "0.12em", sm: "0.2em" },
                textTransform: "uppercase",
                lineHeight: 1,
                backgroundImage:
                  "linear-gradient(270deg, #A9842F 0%, #D7B765 18%, #FBE3A4 38%, #FFF8E8 50%, #FBE3A4 62%, #D7B765 82%, #A9842F 100%)",
                backgroundSize: "250% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${shimmerText} 5s linear infinite`,
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
              }}
            >
              Monopoly
            </Typography>
          </Box>

          {/* Right: login / logout */}
          <Button
            sx={{
              display: pathname === "/login" ? "none" : undefined,
              color: "#F0D48A",
              flexShrink: 0,
            }}
            color="inherit"
            onClick={role === "" ? handleLogin : handleLogout}
          >
            {role === "" ? "Login" : "Logout"}
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Grid>
  );
};

export default Header;
