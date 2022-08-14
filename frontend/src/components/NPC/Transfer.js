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
  Button,
  FormControl,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PropertyCard from "../Properties/PropertyCard";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const Transfer = () => {
  const [from, setFrom] = useState(-1);
  const [to, setTo] = useState(-1);

  const [building, setBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState({});

  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [equal, setEqual] = useState(false);
  const [error, setError] = useState(false);
  const [isEstate, setIsEstate] = useState(true);
  const { teams, setTeams, role, filteredBuildings } = useContext(RoleContext);
  const navigate = useNavigate();
  const handleClick = async () => {
    const payload = {
      from: from,
      to: to,
      IsEstate: isEstate,
      dollar: parseInt(amount),
      equal: equal,
    };
    await axios.post("/transfer", payload);
    navigate("/teams");
  };

  const handleBuilding = async (building) => {
    if (building > 0) {
      const { data } = await axios.get("/land/" + building);
      setBuilding(building);
      setBuildingData(data);
      if (data.owner !== 0) {
        setTo(data.owner);
      }
      if (data.level !== 0) {
        setAmount(data.rent[data.level - 1]);
      }
    } else {
      setBuilding(-1);
      setBuildingData({});
    }
  };

  const handlePercentMoney = (percent) => {
    const item = teams.find((element) => element.teamname === `第${from}小隊`);
    const money = item.money; //find the team's money
    setAmount(Math.round(money * percent));
    setEqual(false);
  };

  const handleEqualMoney = () => {
    let money_from = teams.find(
      (element) => element.teamname === `第${from}小隊`
    ).money; //first team (using the card)
    let money_to = teams.find(
      (element) => element.teamname === `第${to}小隊`
    ).money; //second team(passive)
    let temp = Math.round((money_from - money_to) / 2);
    setAmount(temp);
    setEqual(true);
  };

  useEffect(() => {
    // if (role === "") {
    //   navigate("/permission");
    // }
    // axios
    //   .get("/team")
    //   .then((res) => {
    //     setTeams(res.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const PreviewBuilding = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 1,
          width: "100%",
        }}
      >
        <Typography variant="h6" component="h2">
          Preview Building
        </Typography>
        <PropertyCard {...buildingData} />
        <Typography variant="body1" component="p">
          Series Count: {123}
        </Typography>

        {/* <TableContainer component={Paper}>
          <Table aria-label="rent-table" size="small">
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  <HomeRoundedIcon />
                </TableCell>
                <TableCell align="center">
                  <HomeRoundedIcon />
                  <HomeRoundedIcon />
                </TableCell>
                <TableCell align="center">
                  <HomeRoundedIcon />
                  <HomeRoundedIcon />
                  <HomeRoundedIcon />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">1</TableCell>
                <TableCell align="center">2</TableCell>
                <TableCell align="center">3</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
      </Box>
    );
  };

  const PreviewTransfer = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 1,
          width: "100%",
        }}
      >
        <Typography variant="h6" component="h2">
          Preview Transfer
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="transfer-preview" size="small">
            <TableBody>
              <TableRow>
                <TableCell align="center">Transfer</TableCell>
                <TableCell align="center">From</TableCell>
                <TableCell align="center">To</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Team</TableCell>
                <TableCell align="center">{from}</TableCell>
                <TableCell align="center">{to}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Buff</TableCell>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">No</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Before</TableCell>
                <TableCell align="center">{123}</TableCell>
                <TableCell align="center">{123}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">After</TableCell>
                <TableCell align="center">{123}</TableCell>
                <TableCell align="center">{123}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
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
          Transfer Money
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
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 1 }}
        >
          <TeamSelect
            label="From.."
            team={from}
            handleTeam={setFrom}
            hasZero={false}
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 1 }}
        >
          <TeamSelect
            label="To.."
            team={to}
            handleTeam={setTo}
            hasZero={false}
            sx={{ marginBottom: 2 }}
          />
        </FormControl>

        {/* <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 1 }}
        >
          <FormLabel mx="auto">Is Concerning Estate?</FormLabel>
          <Stack
            direction="row"
            spacing="auto"
            alignItems="center"
            mx={5}
            mt={2}
          >
            <Typography>No</Typography>
            <Switch
              checked={isEstate}
              onChange={(e) => {
                setIsEstate(e.target.checked);
              }}
              label="Is concerning estate"
              size="large"
            />
            <Typography>Yes</Typography>
          </Stack>
        </FormControl> */}
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 2 }}
        >
          {/* <TextField
            required
            label="Amount"
            id="amount"
            value={amount}
            sx={{ marginTop: 2, marginBottom: 2 }}
            onChange={(e) => {
              setAmount(e.target.value);
              setEqual(false);
            }}
          /> */}
          <TextField
            required
            error={error}
            label="Amount"
            id="amount"
            value={amount}
            onChange={(e) => {
              const re = /^[0-9\b]+$/;
              if (e.target.value === "" || re.test(e.target.value)) {
                setAmount(e.target.value ? e.target.value : "");
                setErrorMessage("");
                setError(false);
              } else {
                setErrorMessage("Please enter a valid number");
                setError(true);
              }
            }}
            helperText={errorMessage}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 1,
            }}
          >
            <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={handleEqualMoney}
            >
              Equal
            </Button>
            <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={() => handlePercentMoney(0.05)}
            >
              5%
            </Button>
            <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={() => handlePercentMoney(0.1)}
            >
              10%
            </Button>
          </Box>
          {/* <Button
            disabled={!(from && to && amount) || from === to}
            onClick={handleClick}
          >
            Submit
          </Button> */}
          <Button
            variant="contained"
            disabled={!(from && to && amount) || from === to}
            onClick={handleClick}
            fullWidth
            sx={{ marginTop: 0 }}
          >
            <SendIcon />
          </Button>
        </FormControl>
        {building !== -1 ? <PreviewBuilding /> : null}
        {from !== -1 && to !== -1 ? <PreviewTransfer /> : null}
      </Box>
    </Container>
  );
};
export default Transfer;
