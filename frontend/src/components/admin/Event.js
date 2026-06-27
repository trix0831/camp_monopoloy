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
import MagicButton from "../MagicButton";

const Event = () => {
  const [event, setEvent] = useState(0);
  const [message, setMessage] = useState("無");
  const [APIResponse, setAPIResponse] = useState("");
  const [tempPhase, setTempPhase] = useState(1);
  const [events, setEvents] = useState([]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [resetInput, setResetInput] = useState("");

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

  const handleReset = async () => {
    setOpenDialog(false);
    setResetInput("");
    try {
      await axios.post("/reset", {});
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
              onClick={() => { setResetInput(""); setOpenDialog(true); }}
            >
              RESET
            </Button>
          </Box>

          {APIResponse && <Alert severity="info">{APIResponse}</Alert>}
        </Box>

        {/* ... existing commented out code ... */}

        <Dialog
          open={openDialog}
          onClose={() => { setOpenDialog(false); setResetInput(""); }}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">Confirm Reset?</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              This will reset ALL game data. Type <strong>reset</strong> to confirm.
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="type reset"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && resetInput === "reset") handleReset(); }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDialog(false); setResetInput(""); }} color="primary">
              Cancel
            </Button>
            <MagicButton
              onClick={handleReset}
              color="error"
              variant="contained"
              disabled={resetInput !== "reset"}
            >
              Confirm
            </MagicButton>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
};

export default Event;