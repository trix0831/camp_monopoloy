import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Container,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  FormControl,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table,
  // Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PropertyCard from "../Properties/PropertyCard";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";
import MagicButton from "../MagicButton";

const Interest = () => {
  const [rate, setRate] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const {setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();


  const handleClick = async () => {
    try {
      const payload = {
        rate: Number(rate),
      };
  
      // Await the API call
      await axios.post("/interest", payload);
    } catch (error) {
      console.error("Error posting interest:", error);
      // Optionally, handle the error (e.g., show an error message to the user)
    }

    alert("Interest added");
    // Navigate after the API call completes
    navigate("/teams");
    setNavBarId(2);
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 9,
          marginBottom: 9,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
            Interest Control
        </Typography>
        <Typography component="h1" variant="subtitle2" sx={{ color: 'gray' }}>
            Enter the interest rate.<br/>
            Result = current * rate. (Ex: 1.1 = 10%)
        </Typography>
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 2 }}
        >
          <TextField
            required
            error={error}
            label="Rate"
            id="rate"
            value={rate}
            onChange={(e) => {
              const re = /^\d*\.?\d*$/;
              if (e.target.value === "" || re.test(e.target.value)) {
                setRate(e.target.value ? e.target.value : "");
                setErrorMessage("");
                setError(false);
              } else {
                setErrorMessage("Please enter a valid number");
                setError(true);
              }
            }}
            helperText={errorMessage}
            FormHelperTextProps={{ error: true }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
          </Box>

          <MagicButton
            variant="contained"
            disabled={rate === 0}
            onClick={handleClick}
            fullWidth
            sx={{ marginTop: 1 }}
          >
            <SendIcon />
          </MagicButton>
        </FormControl>
      </Box>
    </Container>
  );
};
export default Interest;
