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
  Alert,
  // Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PropertyCard from "../Properties/PropertyCard";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const Toll = () => {
  const [from, setFrom] = useState(-1);
  const [fromData, setFromData] = useState({});

  const [to, setTo] = useState(-1);
  const [toData, setToData] = useState({});

  const [building, setBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState({});

  const [finalData, setFinalData] = useState({});

  const [amount, setAmount] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleTo = async (to) => {
    const { data } = await axios.get("/team/" + to);
    // console.log(data);
    setToData(data);
    setTo(to);
  };

  const handleFrom = async (from) => {
    const { data: fromData } = await axios.get("/team/" + from);
    setFromData(fromData);
    setFrom(from);
  };

  const FetchFinal = async () => {
    const { data } = await axios.get("/transfer", {
      params: {
        from: from,
        to: to,
        IsEstate: building !== -1,
        dollar: parseInt(amount),
      },
    });
    console.log(data);
    setFinalData(data);
  };

  const handleClick = async () => {
    const payload = {
      from: from,
      to: to,
      IsEstate: building !== -1,
      dollar: parseInt(amount),
    };

    console.log(payload);

    console.log("before post");
    await axios.post("/transfer", payload);
    console.log("after post");
    
    // Update the states with the new values from finalData
    setFromData({ ...fromData, money: finalData.from });
    setToData({ ...toData, money: finalData.to });
    
    navigate("/teams");
    setNavBarId(2);
  };

  const handleBuilding = async (building) => {
    if (building > 0) {
      const { data } = await axios.get("/land/" + building);
      setBuilding(building);
      setBuildingData(data);
      if (data.owner !== 0) {
        handleTo(data.owner); 
      } else {
        setTo(-1);
        setToData({ teamname: "no owner" });
        setFinalData({});
      } 

      const res = await axios.post("/series", {
        teamId: data.owner,
        area: data.area,
      });
      const c = res.data.count;

      if (data.type === "Building") {
        if (data.level !== 0) {
          setAmount(data.rent[data.level - 1]);
        }
      } else {
        setAmount(c * 5000);
      }
    } else {
      setBuilding(-1);
      setBuildingData({});
      setTo(-1);
      setToData({});
      setAmount(0);
    }
  };

  useEffect(() => {
    if (roleId < 10) {
      navigate("/permission");
    }
  }, [roleId]);

  useEffect(() => {
    if (from !== -1 && to !== -1 && amount && parseInt(amount) > 0 && from !== to) {
      FetchFinal();
    }
  }, [from, to, amount]); // eslint-disable-line react-hooks/exhaustive-deps

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

        {buildingData.type === "Building" ? (
          <TableContainer component={Paper}>
            <Table aria-label="rent-table" size="small">
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    初級
                  </TableCell>
                  <TableCell align="center">
                    中級
                  </TableCell>
                  <TableCell align="center">
                    高級
                  </TableCell>
                  <TableCell align="center">
                    頂級
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">{buildingData.rent[0]}</TableCell>
                  <TableCell align="center">{buildingData.rent[1]}</TableCell>
                  <TableCell align="center">{buildingData.rent[2]}</TableCell>
                  <TableCell align="center">{buildingData.rent[3]}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}

        {/* <Typography variant="body1" component="p">
          Series Count: {count}
        </Typography> */}
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
                <TableCell align="center">{fromData.teamname}</TableCell>
                <TableCell align="center">{toData.teamname}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Before</TableCell>
                <TableCell align="center">{fromData.money}</TableCell>
                <TableCell align="center">{toData.money}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">After</TableCell>
                <TableCell align="center">{finalData.from}</TableCell>
                <TableCell align="center">{finalData.to}</TableCell>
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
          Toll Transfer
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
            {filteredBuildings
              .filter((item) => item.type !== "Game")
              .map((item) => (
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
          <InputLabel shrink>To (Owner)</InputLabel>
          <TextField
            disabled
            value={building === -1 ? "" : (toData.teamname || "no owner")}
            variant="standard"
            sx={{ marginTop: 2 }}
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 1 }}
        >
          <TeamSelect
            label="From (Visitor)"
            team={from}
            handleTeam={handleFrom}
            hasZero={false}
            sx={{ marginBottom: 2 }}
          />
          {fromData.money < 0 && (
            <Alert severity="error" sx={{ marginBottom: 1 }}>
              This team is broke!
            </Alert>
          )}
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
            FormHelperTextProps={{ error: true }}
          />

          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 1,
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
              discount
            </Button>
          </Box> */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {/* <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={handleEqualMoney}
            >
              Equal
            </Button> */}
            {/* <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={() => handlePercentMoney(0.5)}
            >
              raise
            </Button> */}

            {/* <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={() => handlePercentMoney(0.1)}
            >
              10%
            </Button> */}
          </Box>
          {/* <Button
            disabled={!(from && to && amount) || from === to}
            onClick={handleClick}
          >
            Submit
          </Button> */}
          {/* <Button
            variant="contained"
            disabled={amount === 0 || from === to}
            onClick={handleDiscount}
            fullWidth
            sx={{ marginTop: 0 }}
          >
            love discount
          </Button> */}

          <Button
            variant="contained"
            disabled={!(from && to && amount) || from === to || fromData.money < 0}
            onClick={handleClick}
            fullWidth
            sx={{ marginTop: 1 }}
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
export default Toll;
