import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  Paper,
  Grid,
  TableBody,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AddIcon from "@mui/icons-material/Add";
import axios from "../axios";
// import navigate from "../navigate";
import RoleContext from "../useRole";
import TeamSelect from "../TeamSelect";

const AddMoney = () => {
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState({});
  const [newData, setNewData] = useState(0);

  const [amount, setAmount] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");

  const [discount, setDiscount] = useState(1);
  const [errorMessage0, setErrorMessage0] = useState("");
  const [error0, setError0] = useState(false);

  const [building, setBuilding] = useState(-1);
  const [price, setPrice] = useState({});
  const [ownerTeamName, setOwnerTeamName] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleTeam = async (team) => {
    if (amount !== "-" && amount !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    if (team !== -1) {
      const { data } = await axios.get("/team/" + team);
      // console.log(data);
      setTeamData(data);
      setTeam(team);
    }
    
  };

  const checkPropertyCost = async (mode) => {
    const payload = { team: team, building: building, mode: mode };
    await axios.post("/checkPropertyCost", payload);
  };

  const handleAmount = async (amount) => {
    if (amount !== "-" && amount !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    setAmount(amount);
  };

  const handleDiscount = () => {
    setAmount(parseInt(amount) * discount);
  };

  const handleBuilding = async (building) => {
    if (building > 0) {
      const { data } = await axios.get("/land/" + building);
      setBuilding(building);
      
      let currentPrice = {};
      if (data.type === "Game") {
        currentPrice = { buy: 2000, upgrade: [], level: data.level, owner: data.owner, type: "Game" };
      } else {
        currentPrice = { ...data.price, level: data.level, owner: data.owner, type: data.type };
      }
      setPrice(currentPrice);
      
      // Fetch owner team name if land has an owner
      if (data.owner !== 0 && data.owner !== undefined && data.owner !== -1) {
        const { data: ownerData } = await axios.get("/team/" + data.owner);
        setOwnerTeamName(ownerData.teamname);
      } else {
        setOwnerTeamName("");
      }
      
      // Auto-set amount based on land ownership status
      if (data.owner === 0) {
        // No owner, use buy price
        setAmount((currentPrice.buy * -1).toString());
      } else if (data.owner === team) {
        // Owned by this team, use upgrade price
        if (data.type === "Game") {
          setAmount("0"); // Game cannot be upgraded
        } else if (data.level < currentPrice.upgrade.length) {
          setAmount((currentPrice.upgrade[data.level - 1] * -1).toString());
        } else {
          setAmount("0");
        }
      } else {
        // Owned by another team, disable button
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

  const handleSubmit = async () => {
    const payload = {
      id: team,
      dollar: parseInt(amount) ? parseInt(amount) : 0
    };
    await axios.post("/add", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  const handleSubmitAndSetOwnership = async () => {
    const payload = {
      id: team,
      dollar: parseInt(amount) ? parseInt(amount) : 0,
    };
    await axios.post("/add", payload);

    const landpayload = { teamId: team, landId: building, moneyPaid: parseInt(amount) ? parseInt(amount) : 0 };
    await axios.post("/npcOwnership", landpayload);

    navigate("/properties?id=" + building);

    setNavBarId(6);
  };

  const SimpleMoneyButton = ({ val }) => {
    return (
      <Button
        variant="contained"
        disabled={team === -1}
        sx={{ marginBottom: 1, width: 80 }}
        onClick={() => {
          // 1. Safely parse the current amount. 
          // If amount is "" or "-", parseInt returns NaN, so we default to 0.
          const currentVal = parseInt(amount) || 0; 
          
          // 2. Add the button value
          const newVal = currentVal + val;

          // 3. Update state, converting back to string to satisfy the TextField
          handleAmount(newVal.toString());
        }}
      >
        {val > 0 ? "+" : ""}
        {val}
      </Button>
    );
  };

  useEffect(() => {
    if (roleId < 17) {
      navigate("/permission");
      setNavBarId(0);
    }
    // axios
    //   .get("/team")
    //   .then((res) => {
    //     setTeams(res.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Typography component="h1" variant="h5" sx={{ marginBottom: 0 }}>
          Money and Properties
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
            <SimpleMoneyButton val={-200} />
            <SimpleMoneyButton val={-400} />
            <SimpleMoneyButton val={-500} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SimpleMoneyButton val={+200} />
            <SimpleMoneyButton val={+400} />
            <SimpleMoneyButton val={+2000} />
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Button
                  variant="contained"
                  disabled={team === -1 || amount === "" || building !== -1 || teamData.money < 0}
                  onClick={handleSubmit}
                  fullWidth
                >
                  <SendIcon />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Button
                  variant="contained"
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
                </Button>
              </Box>
            </Grid>
          </Grid>
        </FormControl>
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h6" sx={{ marginBottom: 0 }}>
            Query Price
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 0 }}>
            <InputLabel id="building">Building</InputLabel>
            <Select
              value={building}
              labelId="building"
              onChange={(e) => {
                handleBuilding(e.target.value);
              }}
            >
              <MenuItem value={-1}>Select Building</MenuItem>
              {filteredBuildings.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.id} {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
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
                {price.upgrade && price.upgrade.map((upgradeCost, index) => (
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
        </Box>

        {showPreview ? (
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
        ) : null}
      </Box>
    </Container>
  );
};
export default AddMoney;
