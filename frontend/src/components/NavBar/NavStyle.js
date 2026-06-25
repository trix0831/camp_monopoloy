export const NavBarStyles = {
  drawer: {
    width: 250,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 210,
      boxSizing: "border-box",
      backgroundImage:
        "linear-gradient(165deg, #16263A 0%, #0E1826 60%, #0B1420 100%)",
      borderRight: "1px solid rgba(215,183,101,0.30)",
      color: "rgba(242, 232, 208, 0.82)",
    },
    "& .MuiToolbar-root": {
      fontFamily: "'Cinzel', serif",
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#F0D48A",
      justifyContent: "center",
    },
    "& .Mui-selected": {
      color: "#F0D48A",
      backgroundColor: "rgba(215,183,101,0.12) !important",
      borderRight: "3px solid #D7B765",
    },
    "& .MuiListItemButton-root:hover, & .MuiListItem-root:hover": {
      backgroundColor: "rgba(215,183,101,0.08)",
    },
  },
  icons: {
    color: "rgba(242, 232, 208, 0.7)!important",
    marginLeft: "5px",
  },
  text: {
    "& span": {
      marginLeft: "-20px",
      fontFamily: "'Cinzel', serif",
      fontWeight: "500",
      fontSize: "14px",
      letterSpacing: "0.03em",
    },
  },
};
