import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Box,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import RoleContext from "./useRole";
// import { socket } from "../websocket";
import axios from "./axios";
import MagicButton from "./MagicButton";

export const roleIdMap = {
  "1A": 1,
  "1B": 2,
  "2A": 3,
  "2B": 4,
  "3A": 5,
  "3B": 6,
  "4A": 7,
  "4B": 8,
  "5A": 9,
  "5B": 10,
  "6A": 11,
  "6B": 12,
  "7A": 13,
  "7B": 14,
  "8A": 15,
  "8B": 16,
  NPC: 50,
  admin: 100,
};

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setRole, setRoleId } = useContext(RoleContext);

  const handleClick = async () => {
    // post /api/login
    const payload = { username: user, password: password };
    const {
      data: { username },
    } = await axios.post("/login", payload);
    // console.log(username);
    if (username !== "") {
      // success!
      setOpen(true);
      setMessage("Successfully login!");
      setRole(username);
      const id = roleIdMap[username];
      setRoleId(id);
      // console.log(roleIdMap[username]);
      localStorage.setItem("role", username);
      navigate("/");
    } else {
      //failed
      setRole("");
      setRoleId(0);
      setMessage("Wrong Username or Password.");
      setOpen(true);
    }
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

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
        <Typography component="h1" variant="h5" sx={{ marginBottom: 1 }}>
          Login
        </Typography>
        <FormControl variant="standard">
          <TextField
            required
            label="Username"
            id="user"
            autoComplete="user"
            type="text"
            sx={{ marginTop: 1, marginBottom: 1 }}
            autoFocus
            onChange={(e) => {
              setUser(e.target.value);
            }}
          />
          <TextField
            required
            label="Password"
            id="password"
            autoComplete="current-password"
            type="password"
            sx={{ marginTop: 1, marginBottom: 1 }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <MagicButton
            sx={{ marginTop: 1 }}
            disabled={!(user && password)}
            onClick={handleClick}
          >
            Login
          </MagicButton>
        </FormControl>
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          sx={{ width: "100%" }}
          severity={message === "Successfully login!" ? "success" : "warning"}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
