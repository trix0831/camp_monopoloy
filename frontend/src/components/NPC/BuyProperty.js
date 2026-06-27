import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  Paper,
  TableBody,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AddIcon from "@mui/icons-material/Add";
import axios from "../axios";
import RoleContext from "../useRole";
import TeamSelect from "../TeamSelect";
import MagicButton from "../MagicButton";

const BuyProperty = () => {
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState({});
  const [newData, setNewData] = useState(0);
  const [amount, setAmount] = useState("0");
  const [building, setBuilding] = useState(-1);
  const [price, setPrice] = useState({});
  const [ownerTeamName, setOwnerTeamName] = useState("");

  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleTeam = async (selectedTeam) => {
    if (selectedTeam !== -1) {
      const { data } = await axios.get("/team/" + selectedTeam);
      setTeamData(data);
      setTeam(selectedTeam);
      // Re-evaluate cost for the selected building with the new team
      if (building > 0) {
        const { data: landData } = await axios.get("/land/" + building);
        if (landData.owner === 0) {
          setAmount((price.buy * -1).toString());
        } else if (landData.owner === selectedTeam) {
          if (landData.type === "Game") {
            setAmount("0");
          } else if (landData.level < price.upgrade.length) {
            setAmount((price.upgrade[landData.level - 1] * -1).toString());
          } else {
            setAmount("0");
          }
        } else {
          setAmount("0");
        }
      }
    }
  };

  const handleBuilding = async (selectedBuilding) => {
    if (selectedBuilding > 0) {
      const { data } = await axios.get("/land/" + selectedBuilding);
      setBuilding(selectedBuilding);

      let currentPrice = {};
      if (data.type === "Game") {
        currentPrice = { buy: 2000, upgrade: [], level: data.level, owner: data.owner, type: "Game" };
      } else {
        currentPrice = { ...data.price, level: data.level, owner: data.owner, type: data.type };
      }
      setPrice(currentPrice);

      if (data.owner !== 0 && data.owner !== undefined && data.owner !== -1) {
        const { data: ownerData } = await axios.get("/team/" + data.owner);
        setOwnerTeamName(ownerData.teamname);
      } else {
        setOwnerTeamName("");
      }

      if (data.owner === 0) {
        setAmount((currentPrice.buy * -1).toString());
      } else if (data.owner === team) {
        if (data.type === "Game") {
          setAmount("0");
        } else if (data.level < currentPrice.upgrade.length) {
          setAmount((currentPrice.upgrade[data.level - 1] * -1).toString());
        } else {
          setAmount("0");
        }
      } else {
        setAmount("0");
      }
    } else {
      setBuilding(-1);
      setPrice({});
      setOwnerTeamName("");
      setAmount("0");
    }
  };

  const handlePreview = async () => {
    const { data } = await axios.get("/add", {
      params: { id: team, dollar: amount },
    });
    setNewData(data.money);
  };

  const handleSubmitAndSetOwnership = async () => {
    const payload = { id: team, dollar: parseInt(amount) ? parseInt(amount) : 0 };
    await axios.post("/add", payload);
    const landpayload = { teamId: team, landId: building, moneyPaid: parseInt(amount) ? parseInt(amount) : 0 };
    await axios.post("/npcOwnership", landpayload);
    navigate("/properties?id=" + building);
    setNavBarId(3);
  };

  useEffect(() => {
    if (roleId < 17) {
      navigate("/permission");
      setNavBarId(0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (team !== -1 && amount !== "0") {
      handlePreview();
    }
  }, [team, amount]); // eslint-disable-line react-hooks/exhaustive-deps

  const showPreview = team !== -1 && building > 0 && amount !== "0";

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
          Buy Property
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect label="Team" team={team} handleTeam={handleTeam} hasZero={false} />
          {teamData.money < 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              This team is broke!
            </Alert>
          )}
        </FormControl>

        <Box
          sx={{
            marginTop: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormControl variant="standard" sx={{ minWidth: 250 }}>
            <InputLabel id="building">Building</InputLabel>
            <Select
              value={building}
              labelId="building"
              onChange={(e) => handleBuilding(e.target.value)}
            >
              <MenuItem value={-1}>Select Building</MenuItem>
              {filteredBuildings.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.id} {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TableContainer component={Paper} sx={{ mt: 2, minWidth: 250 }}>
            <Table aria-label="price table" size="small">
              <TableBody>
                <TableRow>
                  <TableCell align="left">Owner</TableCell>
                  <TableCell align="right">
                    {price.owner && price.owner !== 0 ? ownerTeamName : "Not Owned"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">Level</TableCell>
                  <TableCell align="right">
                    {price.level !== undefined ? price.level : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">Buy (★)</TableCell>
                  <TableCell align="right">
                    {price.buy !== null && price.buy !== undefined ? price.buy : ""}
                  </TableCell>
                </TableRow>
                {price.upgrade &&
                  price.upgrade.map((upgradeCost, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">Upgrade {index + 1} (★{index + 2})</TableCell>
                      <TableCell align="right">{upgradeCost}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {building > 0 && (
            <Box
              sx={{ marginTop: 2 }}
              justifyContent="center"
              alignItems="center"
              display="flex"
              flexDirection="column"
            >
              <Typography component="h1" variant="h6" sx={{ marginBottom: 1 }}>
                Action and Cost
              </Typography>
              {price.owner === 0 && (
                <Typography component="h2" variant="body2" sx={{ marginBottom: 0 }}>
                  Action: Buy
                </Typography>
              )}
              {price.owner === team && (
                <Typography component="h2" variant="body2" sx={{ marginBottom: 0 }}>
                  Action: {price.type === "Game" ? "Max Level" : "Upgrade"}
                </Typography>
              )}
              <Typography component="h2" variant="body2" sx={{ marginBottom: 0.5 }}>
                Cost: {amount}
              </Typography>
            </Box>
          )}

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

          <MagicButton
            variant="contained"
            sx={{ mt: 2, minWidth: 250 }}
            disabled={
              team === -1 ||
              amount === "0" ||
              building === -1 ||
              (price.owner !== 0 && price.owner !== team) ||
              newData < 0 ||
              teamData.money < 0
            }
            onClick={handleSubmitAndSetOwnership}
            fullWidth
          >
            <SendIcon />
            <AddIcon />
            <RequestQuoteIcon />
          </MagicButton>
        </Box>
      </Box>
    </Container>
  );
};

export default BuyProperty;
