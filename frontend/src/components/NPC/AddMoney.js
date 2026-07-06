import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "../axios";
import RoleContext from "../useRole";
import TeamSelect from "../TeamSelect";
import MagicButton from "../MagicButton";

const AddMoney = () => {
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState({});
  const [newData, setNewData] = useState(0);
  const [amount, setAmount] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const { roleId, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleTeam = async (selectedTeam) => {
    if (amount !== "-" && amount !== "" && selectedTeam !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    if (selectedTeam !== -1) {
      const { data } = await axios.get("/team/" + selectedTeam);
      setTeamData(data);
      setTeam(selectedTeam);
    }
  };

  const handleAmount = (val) => {
    if (val !== "-" && val !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    setAmount(val);
  };

  const handlePreview = async () => {
    const { data } = await axios.get("/add", {
      params: { id: team, dollar: amount },
    });
    setNewData(data.money);
  };

  const handleSubmit = async () => {
    const payload = {
      id: team,
      dollar: parseInt(amount) ? parseInt(amount) : 0,
    };
    await axios.post("/add", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  const SimpleMoneyButton = ({ val, fullWidth }) => (
    <Button
      variant="contained"
      disabled={team === -1}
      fullWidth={fullWidth}
      sx={{ marginBottom: 1, width: fullWidth ? undefined : 80 }}
      onClick={() => {
        const currentVal = parseInt(amount) || 0;
        handleAmount((currentVal + val).toString());
      }}
    >
      {val > 0 ? "+" : ""}
      {val}
    </Button>
  );

  useEffect(() => {
    if (roleId < 17) {
      navigate("/permission");
      setNavBarId(0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (team !== -1 && amount !== 0) {
      handlePreview();
    }
  }, [team, amount]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Control Money
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect
            label="Team"
            team={team}
            handleTeam={handleTeam}
            hasZero={false}
          />
          {teamData.money < 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              This team is broke!
            </Alert>
          )}

          <TextField
            required
            label="Amount"
            id="amount"
            value={amount}
            sx={{ marginTop: 2, marginBottom: 1 }}
            onChange={(e) => {
              const re = /^-?[0-9\b]+$/;
              if (
                e.target.value === "-" ||
                e.target.value === "" ||
                re.test(e.target.value)
              ) {
                if (Math.abs(parseInt(e.target.value)) > 1000000) {
                  setErrorMessage("Too Large");
                } else {
                  handleAmount(e.target.value ? e.target.value : "");
                  setErrorMessage("");
                }
              } else {
                setErrorMessage("Please enter a valid number");
              }
            }}
            helperText={errorMessage}
            FormHelperTextProps={{ error: true }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SimpleMoneyButton val={-300} />
            <SimpleMoneyButton val={-500} />
            <SimpleMoneyButton val={-800} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SimpleMoneyButton val={+300} />
            <SimpleMoneyButton val={+500} />
            <SimpleMoneyButton val={+800} />
          </Box>
          <SimpleMoneyButton val={+2000} fullWidth />

          <MagicButton
            variant="contained"
            disabled={team === -1 || amount === "" || teamData.money < 0}
            onClick={handleSubmit}
            fullWidth
          >
            <SendIcon />
          </MagicButton>
        </FormControl>

        {showPreview && (
          <Box
            sx={{ marginTop: 2 }}
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Typography component="h1" variant="h6" sx={{ marginBottom: 1 }}>
              Preview
            </Typography>
            <Typography component="h2" variant="body2" sx={{ marginBottom: 1 }}>
              {teamData.teamname}: {teamData.money} &gt;&gt; {newData}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AddMoney;
