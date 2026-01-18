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

  const [showPreview, setShowPreview] = useState(false);
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleTeam = async (team) => {
    if (amount !== "-" && amount !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    const { data } = await axios.get("/team/" + team);
    // console.log(data);
    setTeamData(data);
    setTeam(team);
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
      setPrice({ ...data.price, level: data.level, owner: data.owner });
    } else {
      setBuilding(-1);
      setPrice({});
    }
    // console.log(data);
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
      teamname: `第${team}小隊`,
      dollar: parseInt(amount) ? parseInt(amount) : 0,
    };
    await axios.post("/add", payload);
    navigate("/setownership?id=" + building + "&team=" + team);
    setNavBarId(6);
  };

  const SimpleMoneyButton = ({ val }) => {
    return (
      <Button
        variant="contained"
        disabled={team === -1}
        sx={{ marginBottom: 1, width: 80 }}
        onClick={() => {
          if (!amount) {
            handleAmount(val);
          } else {
            handleAmount(parseInt(amount) + val);
          }
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
          Add Money
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect
            label="Team"
            team={team}
            handleTeam={handleTeam}
            hasZero={false}
          />

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
            <SimpleMoneyButton val={+4000} />
            <SimpleMoneyButton val={+10000} />
            <SimpleMoneyButton val={+16000} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SimpleMoneyButton val={+2000} />
            <SimpleMoneyButton val={+3000} />
            <SimpleMoneyButton val={+5000} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              disabled={team === -1 || !price.buy}
              sx={{ marginBottom: 1, width: 120 }}
              onClick={() => {
                handleAmount(-1 * price.buy);
                checkPropertyCost("Buy");
              }}
            >
              Buy
            </Button>
            <Button
              variant="contained"
              disabled={team === -1 || !price.upgrade || price.level >= price.upgrade.length}
              sx={{ marginBottom: 1, width: 120 }}
              onClick={() => {
                const cost = price.upgrade[price.level - 1];
                handleAmount(-1 * cost);
                checkPropertyCost("Upgrade");
              }}
            >
              Upgrade
            </Button>
          </Box>

          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 1,
              marginBottom: 1,
              width: "100%",
            }}
          >
            <TextField
              required
              error={error0}
              label="discount"
              id="discount"
              value={discount}
              onChange={(e) => {
                const re = /^\d*\.?\d*$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setDiscount(e.target.value ? e.target.value : "");
                  setErrorMessage0("");
                  setError0(false);
                } else {
                  setErrorMessage0("Please enter a valid number");
                  setError0(true);
                }
              }}
              helperText={errorMessage0}
              FormHelperTextProps={{ error: true }}
            />

            <Button
              variant="contained"
              disabled={amount === 0 || discount === 1}
              onClick={handleDiscount}
              fullWidth
              sx={{ marginLeft: 1 }}
            >
              Calculate
            </Button>
          </Box> */}

          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              disabled={team === -1 || amount === 0}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => handlePercentMoney(-0.2)}
            >
              -20%
            </Button>
            <Button
              variant="contained"
              disabled={team === -1 || amount === 0}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => handlePercentMoney(0.5)}
            >
              +50%
            </Button>
            <Button
              variant="contained"
              disabled={team === -1 || amount === 0}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => handlePercentMoney(1)}
            >
              +100%
            </Button>
          </Box> */}
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Button
                  variant="contained"
                  disabled={team === -1 || amount === ""}
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
                    building === -1 
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
                    {price.owner && price.owner !== 0 ? `Team ${price.owner}` : "Not Owned"}
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
              {teamData.money} &gt;&gt; {newData}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Container>
  );
};
export default AddMoney;
