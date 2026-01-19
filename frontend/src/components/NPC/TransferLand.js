import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Snackbar,
  Alert,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import PropertyCard from "../Properties/PropertyCard";
import Loading from "../Loading";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const TransferLand = () => {
  const [buyerTeam, setBuyerTeam] = useState(-1);
  const [buyerData, setBuyerData] = useState({});
  const [sellerTeam, setSellerTeam] = useState(-1);
  const [sellerData, setSellerData] = useState({});
  const [land, setLand] = useState(-1);
  const [landData, setLandData] = useState({});
  const [transferAmount, setTransferAmount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [allTeams, setAllTeams] = useState([]);
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleBuyerTeam = async (team) => {
    if (team === -1) return;
    const { data } = await axios.get("/team/" + team);
    setBuyerData(data);
    setBuyerTeam(team);
    // Pass current landData state as the 4th argument
    validateAndCalculate(team, sellerTeam, land, landData);
  };

  const handleLand = async (landId) => {
    const { data } = await axios.get("/land/" + landId);
    setLandData(data);
    setLand(landId);

    if (data.owner === 0) {
      setError(true);
      setErrorMessage("This land is not owned by anyone. Cannot transfer unowned land!");
      setShowPreview(false);
      return;
    }

    const { data: seller } = await axios.get("/team/" + data.owner);
    setSellerTeam(data.owner);
    setSellerData(seller);
    
    // FIX: Pass 'data' as the 4th argument here
    validateAndCalculate(buyerTeam, data.owner, landId, data);
  };

  const calculateUpgradeCost = (landData) => {
    // For level 1 lands, there are no upgrades, so cost is 0
    if (landData.level <= 1) {
      return 0;
    }
    return (landData.level - 1) * landData.price.upgrade[landData.level - 2];
  };

  // Add a 4th argument: specificLandData
  const validateAndCalculate = (buyer, seller, landId, specificLandData = null) => {
    setError(false);
    setErrorMessage("");
    setShowPreview(false);

    // Validate selections
    if (buyer === -1 || seller === -1 || landId === -1) {
      return;
    }

    // Check if buyer and seller are different
    if (buyer === seller) {
      setError(true);
      setErrorMessage("Buyer and seller must be different teams!");
      return;
    }

    // Use the passed data if provided, otherwise fallback to state
    const currentLandData = specificLandData || (landData.id === landId ? landData : null);
    
    // If we still don't have valid data, stop
    if (!currentLandData || currentLandData.id !== landId) {
      return;
    }

    // Check if seller owns the land
    if (currentLandData.owner !== seller) {
      setError(true);
      setErrorMessage("Seller does not own this land!");
      return;
    }

    // Calculate transfer amount
    const upgradeCost = calculateUpgradeCost(currentLandData);
    const netValue = currentLandData.price.buy + upgradeCost;
    const amount = netValue * 4;
    setTransferAmount(amount);

    setShowPreview(true);
  };

  const handleTransfer = async () => {
    try {
      // Check if buyer has enough money
      if (buyerData.money < transferAmount) {
        setError(true);
        setErrorMessage("Buyer does not have enough money!");
        return;
      }

      const payload = {
        buyerTeamId: buyerTeam,
        sellerTeamId: sellerTeam,
        landId: land,
        amount: transferAmount,
      };

      await axios.post("/transferLand", payload);

      // Navigate to properties view
      navigate("/properties?id=" + land);
      setNavBarId(3);
    } catch (err) {
      setError(true);
      setErrorMessage("Transfer failed: " + (err.response?.data || err.message));
    }
  };

  useEffect(() => {
    if (roleId < 17) {
      navigate("/permission");
    }
    
    // Fetch all teams on component mount
    const fetchAllTeams = async () => {
      try {
        const { data } = await axios.get("/team");
        setAllTeams(data);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      }
    };
    
    fetchAllTeams();
  }, [roleId, navigate]);

  // Re-validate and update preview whenever buyer team changes (if land is already selected)
  useEffect(() => {
    if (buyerTeam !== -1 && sellerTeam !== -1 && land !== -1) {
      validateAndCalculate(buyerTeam, sellerTeam, land, landData);
    }
  }, [buyerTeam]);

  if (filteredBuildings.length === 0) {
    return <Loading />;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 10,
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 3 }}>
          Transfer Land Between Teams
        </Typography>

        {/* Buyer Team Selection */}
        <FormControl variant="standard" sx={{ minWidth: 300, marginTop: 2 }}>
          <InputLabel>Buyer Team</InputLabel>
          <Select
            value={buyerTeam}
            onChange={(e) => handleBuyerTeam(e.target.value)}
          >
            <MenuItem value={-1}>Select Buyer Team</MenuItem>
            {allTeams.map((team) => (
              <MenuItem value={team.id} key={team.id}>
                {team.teamname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Seller Team Display */}
        {sellerTeam !== -1 && (
          <FormControl variant="standard" sx={{ minWidth: 300, marginTop: 2 }} disabled>
            <InputLabel>Seller Team (Auto-filled from Land Owner)</InputLabel>
            <Select value={sellerTeam}>
              <MenuItem value={sellerTeam}>
                {sellerData.teamname}
              </MenuItem>
            </Select>
            <FormHelperText>Seller is automatically determined by the land owner</FormHelperText>
          </FormControl>
        )}

        {/* Land Selection */}
        <FormControl variant="standard" sx={{ minWidth: 300, marginTop: 2 }}>
          <InputLabel>Land/Building to Transfer</InputLabel>
          <Select value={land} onChange={(e) => handleLand(e.target.value)}>
            <MenuItem value={-1}>Select Land</MenuItem>
            {filteredBuildings.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                {item.id} {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ marginTop: 2, width: "100%" }}>
            {errorMessage}
          </Alert>
        )}

        {/* Preview and Details */}
        {showPreview && (
          <>
            <Box sx={{ marginTop: 3, width: "100%" }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Transaction Details
              </Typography>

              <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Land Name:</strong>
                      </TableCell>
                      <TableCell>{landData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Current Level:</strong>
                      </TableCell>
                      <TableCell>{landData.level}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Base Price:</strong>
                      </TableCell>
                      <TableCell>${landData.price.buy}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Upgrade Cost to Current Level:</strong>
                      </TableCell>
                      <TableCell>
                        ${calculateUpgradeCost(landData)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Net Value:</strong>
                      </TableCell>
                      <TableCell>
                        ${landData.price.buy + calculateUpgradeCost(landData)}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                      <TableCell>
                        <strong>Transfer Amount (4x Net Value):</strong>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "blue" }}>
                        ${transferAmount}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Buyer Money Before:</strong>
                      </TableCell>
                      <TableCell>${buyerData.money}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Buyer Money After:</strong>
                      </TableCell>
                      <TableCell sx={{ color: buyerData.money - transferAmount < 0 ? "red" : "green" }}>
                        ${buyerData.money - transferAmount}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Seller Money Before:</strong>
                      </TableCell>
                      <TableCell>${sellerData.money}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Seller Money After:</strong>
                      </TableCell>
                      <TableCell sx={{ color: "green" }}>
                        ${sellerData.money + transferAmount}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 3 }}>
                Property Preview
              </Typography>
              <PropertyCard {...landData} hawkEye={-1} />
            </Box>

            {/* Transfer Button */}
            <Button
              variant="contained"
              color="primary"
              disabled={
                buyerTeam === -1 ||
                sellerTeam === -1 ||
                land === -1 ||
                error ||
                buyerData.money < transferAmount
              }
              onClick={handleTransfer}
              fullWidth
              sx={{ marginTop: 3 }}
              startIcon={<SendIcon />}
            >
              Confirm Transfer
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default TransferLand;
