import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  Box,
  Button,
  FormControl,
  Alert,
  // New imports for the confirmation dialog
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Loading from "../Loading";
import RoleContext from "../useRole";
import axios from "../axios";

const Event = () => {
  const [event, setEvent] = useState(0);
  const [message, setMessage] = useState("無");
  const [APIResponse, setAPIResponse] = useState("");
  const [tempPhase, setTempPhase] = useState(1);
  const [events, setEvents] = useState([]);
  
  // New state for confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);

  const { role, setPhase } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    await axios.post("/event", { id: event }).then((res) => {
      setAPIResponse(res.data);
    });
    // navigate("/notifications");
  };

  const handleClick2 = async () => {
    setPhase(tempPhase);
    await axios.post("/phase", { phase: tempPhase });
    navigate("/notifications");
  };

  const handleMoneyPercent = async () => {
    await axios.post("/percent", {});
    navigate("/teams");
  };

  const handleResourcePercent = async () => {
    console.log("in");
    await axios.post("/cutResource", {});
    navigate("/teams");
  };

  // This function remains the same, but it is now called by the Dialog
  const handleReset = async () => {
    // Close dialog first
    setOpenDialog(false);
    
    try {
      console.log("reset");
      await axios.post("/reset", {});
      navigate("/teams");
    } catch (error) {
      console.error("There was an error resetting:", error);
    }
    navigate("/teams");
  };

  useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
    }
    axios
      .get("/allEvents")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (events.length === 0) {
    return <Loading />;
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ... existing commented out code ... */}

          <Box
            sx={{
              marginTop: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              component="h1"
              variant="subtitle2"
              sx={{ color: "gray", marginBottom: 2 }}
            >
              CAUTION: It will reset EVERYTHING.
            </Typography>
            <Button
              variant="contained"
              sx={{
                width: 120,
                backgroundColor: "red",
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
              // UPDATE: Don't run reset immediately, open the dialog instead
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              RESET
            </Button>
          </Box>

          {APIResponse && <Alert severity="info">{APIResponse}</Alert>}
        </Box>

        {/* ... existing commented out code ... */}

        {/* --- CONFIRMATION DIALOG START --- */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Reset?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to reset? This action cannot be undone and will reset everything.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleReset} 
              color="error" 
              variant="contained"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/* --- CONFIRMATION DIALOG END --- */}
      </Container>
    );
  }
};

export default Event;