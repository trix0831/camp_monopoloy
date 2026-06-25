import { createTheme } from "@mui/material";

/**
 * "NTU Sunflower Camp" — magical Harry-Potter inspired theme.
 * Palette is sampled from GoldBeauty.jpg: midnight navy-slate skies
 * with enchanted gold (the Snitch / candlelight) as the hero accent.
 */

// --- Brand tokens ---------------------------------------------------------
const GOLD = "#D7B765"; // candlelit gold (primary accent)
const GOLD_BRIGHT = "#F0D48A"; // highlight / hover
const GOLD_DEEP = "#A9842F"; // pressed / borders
const NAVY = "#0E1826"; // deepest midnight
const NAVY_SURFACE = "#16263A"; // card / paper slate-blue
const PARCHMENT = "#F2E8D0"; // primary text on dark
const PARCHMENT_MUTED = "#C7BCA0"; // secondary text

const palette = {
  mode: "dark",
  primary: {
    main: GOLD,
    light: GOLD_BRIGHT,
    dark: GOLD_DEEP,
    contrastText: "#1A1206",
  },
  secondary: {
    main: "#E0A33A",
    light: "#F2C268",
    dark: "#B27A1E",
    contrastText: "#1A1206",
  },
  error: { main: "#E06A5E" },
  success: { main: "#7BAE6E" },
  warning: { main: "#E0A33A" },
  info: { main: "#6FA8C7" },
  background: {
    default: NAVY,
    paper: NAVY_SURFACE,
  },
  text: {
    primary: PARCHMENT,
    secondary: PARCHMENT_MUTED,
  },
  divider: "rgba(215, 183, 101, 0.22)",
};

const theme = createTheme({
  palette,
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: NAVY },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Cinzel', serif",
          fontSize: "0.9rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          borderRadius: 10,
          textTransform: "none",
          paddingInline: "18px",
          minHeight: 44, // accessible touch target
        },
        contained: {
          color: "#1A1206",
          background: `linear-gradient(135deg, ${GOLD_BRIGHT} 0%, ${GOLD} 52%, ${GOLD_DEEP} 100%)`,
          boxShadow: "0 4px 14px rgba(215,183,101,0.30)",
          "&:hover": {
            background: `linear-gradient(135deg, #FBE3A4 0%, ${GOLD_BRIGHT} 55%, ${GOLD} 100%)`,
            boxShadow: "0 6px 20px rgba(215,183,101,0.45)",
          },
        },
        outlined: {
          borderColor: "rgba(215,183,101,0.55)",
          color: GOLD_BRIGHT,
          "&:hover": {
            borderColor: GOLD,
            backgroundColor: "rgba(215,183,101,0.10)",
          },
        },
        text: { color: GOLD_BRIGHT },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { fontSize: "1.7rem" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(100deg, #0B1420 0%, #16263A 55%, #0E1C2C 100%)",
          backgroundColor: "#0B1420",
          borderBottom: "1px solid rgba(215,183,101,0.35)",
          boxShadow: "0 4px 22px rgba(0,0,0,0.55)",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(180deg, #16263A 0%, #0B1420 100%)",
          borderTop: "1px solid rgba(215,183,101,0.30)",
          "& .MuiBottomNavigationAction-root": {
            color: "rgba(242,232,208,0.62)",
          },
          "& .Mui-selected": {
            color: `${GOLD_BRIGHT} !important`,
          },
          "& .Mui-selected svg": {
            filter: "drop-shadow(0 0 6px rgba(240,212,138,0.7))",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        outlined: { borderColor: "rgba(215,183,101,0.25)" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(160deg, rgba(34,52,74,0.95) 0%, rgba(20,33,49,0.95) 100%)",
          border: "1px solid rgba(215,183,101,0.22)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": { borderColor: "rgba(215,183,101,0.35)" },
          "&:hover fieldset": { borderColor: "rgba(215,183,101,0.6)" },
          "&.Mui-focused fieldset": { borderColor: GOLD },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { "&.Mui-focused": { color: GOLD_BRIGHT } },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: { borderColor: "rgba(215,183,101,0.45)" },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(215,183,101,0.22)" },
      },
    },
  },
  typography: {
    fontFamily: "'EB Garamond', 'Merriweather', Georgia, serif",
    fontSize: 14,
    h1: {
      fontFamily: "'Cinzel', serif",
      fontSize: "1.6rem",
      fontWeight: 700,
      color: "#F2E8D0",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    h2: { fontFamily: "'Cinzel', serif", fontWeight: 700 },
    h3: { fontFamily: "'Cinzel', serif", fontWeight: 700 },
    h4: { fontFamily: "'Cinzel', serif", fontWeight: 600 },
    h5: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 600,
      letterSpacing: "0.04em",
    },
    h6: { fontFamily: "'Cinzel', serif", fontSize: "1.2rem", fontWeight: 600 },
    button: { fontFamily: "'Cinzel', serif" },
    body2: { fontSize: "1rem" },
  },
});
export default theme;
