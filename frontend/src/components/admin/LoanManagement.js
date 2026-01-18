import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  FormControl,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import RoleContext from "../useRole";
import SendIcon from "@mui/icons-material/Send";
import Loading from "../Loading";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const LoanManagement = () => {
  const { teams, setTeams, roleId, setNavBarId } = useContext(RoleContext);
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState({});
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleTeam = async (teamId) => {
    if (amount !== "-" && amount !== "" && teamId !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    const { data } = await axios.get("/team/" + teamId);
    setTeamData(data);
    setTeam(teamId);
  };

  const handleAmount = (value) => {
    const re = /^-?\d*\.?\d*$/;
    if (value === "" || re.test(value)) {
      setAmount(value);
      setErrorMessage("");
      setError(false);
      if (value !== "-" && value !== "" && team !== -1) {
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    } else {
      setErrorMessage("Please enter a valid number");
      setError(true);
      setShowPreview(false);
    }
  };

  const handleSubmit = async () => {
    const loanAmount = parseInt(amount);
    if (!amount || loanAmount === 0) {
      setErrorMessage("Please enter a non-zero amount");
      setError(true);
      return;
    }

    try {
      const payload = {
        id: team,
        loan: loanAmount,
      };
      await axios.post("/loan", payload);
      alert("Loan updated successfully");
      navigate("/teams");
      setNavBarId(2);
    } catch (err) {
      console.error("Error updating loan:", err);
      setErrorMessage("Error updating loan");
      setError(true);
    }
  };

  const getTeams = async () => {
    axios
      .get("/team")
      .then((res) => {
        setTeams(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const SimpleMoneyButton = ({ val }) => {
    return (
      <Button
        variant="contained"
        disabled={team === -1}
        sx={{ marginBottom: 1, width: 80 }}
        onClick={() => {
          if (!amount || amount === "0") {
            handleAmount(String(val));
          } else {
            handleAmount(String(parseInt(amount) + val));
          }
        }}
      >
        {val > 0 ? "+" : ""}
        {val}
      </Button>
    );
  };

  useEffect(() => {
    getTeams();
    const id = setInterval(() => {
      getTeams();
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (teams.length === 0) {
    return <Loading />;
  } else {
    return (
      <>
        {roleId > 20 ? (
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
                Loan Management
              </Typography>
              <Typography
                component="h1"
                variant="subtitle2"
                sx={{ color: "gray", textAlign: "center" }}
              >
                When a team loans money, both money and loan increase by the same amount.
              </Typography>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <TeamSelect
                  label="Team"
                  team={team}
                  handleTeam={handleTeam}
                  hasZero={false}
                />

                <TextField
                  required
                  error={error}
                  label="Amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => handleAmount(e.target.value)}
                  helperText={errorMessage}
                  FormHelperTextProps={{ error: true }}
                  sx={{ marginTop: 2 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 2,
                    gap: 1,
                  }}
                >
                  <SimpleMoneyButton val={100} />
                  <SimpleMoneyButton val={500} />
                  <SimpleMoneyButton val={1000} />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 1,
                    gap: 1,
                  }}
                >
                  <SimpleMoneyButton val={-100} />
                  <SimpleMoneyButton val={-500} />
                  <SimpleMoneyButton val={-1000} />
                </Box>
              </FormControl>

              {showPreview && team !== -1 && (
                <Paper
                  elevation={3}
                  sx={{
                    marginTop: 3,
                    padding: 2,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {teamData.teamname}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Current Money
                      </Typography>
                      <Typography variant="h6">
                        {Math.round(teamData.money)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Current Loan
                      </Typography>
                      <Typography variant="h6">
                        {Math.round(teamData.loan)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        New Money
                      </Typography>
                      <Typography variant="h6" sx={{ color: "green" }}>
                        {Math.round(teamData.money + (parseInt(amount) || 0))}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        New Loan
                      </Typography>
                      <Typography variant="h6" sx={{ color: "green" }}>
                        {Math.round(teamData.loan + (parseInt(amount) || 0))}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Button
                variant="contained"
                disabled={!showPreview || error}
                onClick={handleSubmit}
                fullWidth
                sx={{ marginTop: 3 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Container>
        ) : (
          navigate("/permission")
        )}
      </>
    );
  }
};

export default LoanManagement;
