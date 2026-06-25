import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
} from "@mui/material";
import RoleContext from "../useRole";
import TeamSelect from "../TeamSelect";
import Loading from "../Loading";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Bankrupt = () => {
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const { teams } = useContext(RoleContext);
  const navigate = useNavigate();

  // Fetch team data when team changes
  useEffect(() => {
    if (team !== -1) {
      fetchTeamData();
    } else {
      setTeamData(null);
      setProperties([]);
    }
  }, [team]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      // Fetch team info
      const teamRes = await axios.get(`/team/${team}`);
      setTeamData(teamRes.data);

      // Fetch properties owned by this team
      const propsRes = await axios.get(`/property/${team}`);
      setProperties(propsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate buyback price (60% of buy price + all upgrades)
  const calculateBuybackPrice = (property) => {
    // If property is undefined or null, return 0 to be safe
    if (!property) return 0;

    let totalInvested = 0;
    
    // Explicitly handle "Game" properties
    if (property.type === "Game") {
      totalInvested = 2000;
    } else {
      // For standard buildings
      if (!property.price) return 0;
      
      const totalBuyPrice = property.price.buy;
      const upgradeCost = property.price.upgrade
        ? property.price.upgrade
            .slice(0, Math.max(0, property.level - 1))
            .reduce((a, b) => a + b, 0)
        : 0;
      totalInvested = totalBuyPrice + upgradeCost;
    }
    
    return Math.round(totalInvested * 0.6);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(properties.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSoldOut = async () => {
    if (selected.length === 0) return;
    if (window.confirm(`Are you sure you want to sell ${selected.length} properties?`)) {
      try {
        const payload = { id: team, buildings: selected };
        await axios.post("/soldout", payload);
        await fetchTeamData();
        alert("Properties sold successfully!");
        navigate("/teams");
      } catch (error) {
        console.error("Error selling properties:", error);
        alert("Failed to sell properties.");
      }
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h5" variant="h5" sx={{ marginBottom: 3, marginTop: 3 }}>
          Bankrupt Management
        </Typography>

        {/* Team Selection */}
        <FormControl sx={{ minWidth: 300, marginBottom: 3 }}>
          <TeamSelect
            label="Select Team"
            team={team}
            handleTeam={setTeam}
            hasZero={false}
          />
        </FormControl>

        {/* Team Info Section */}
        {team !== -1 && teamData && (
          <Paper
            sx={{
              width: "100%",
              padding: 2,
              marginBottom: 3,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              <strong>Team:</strong> {teamData.teamname}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Current Money:</strong> ${Math.round(teamData.money)}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Total Loan:</strong> ${Math.round(teamData.loan)}
            </Typography>
            <Typography variant="body1">
              <strong>Property Value:</strong> ${Math.round(teamData.propertyValue)}
            </Typography>
          </Paper>
        )}

        {/* Properties Section */}
        {team !== -1 && (
          <Paper sx={{ width: "100%", padding: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Properties Owned
              </Typography>
              <Button
                variant="contained"
                color="error"
                disabled={selected.length === 0}
                onClick={handleSoldOut}
              >
                Sell Selected ({selected.length})
              </Button>
            </Box>

            {loading ? (
              <Loading />
            ) : properties.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", padding: 2 }}>
                No property
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(215,183,101,0.08)" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selected.length > 0 && selected.length < properties.length}
                          checked={properties.length > 0 && selected.length === properties.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Property ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Property Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Level
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Total Invested
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Buyback (60%)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {properties.map((property) => {
                      let totalInvested = 0;
                      let upgradeCost = 0;

                      if (property.type === "Game") {
                        totalInvested = 2000;
                        upgradeCost = 0;
                      } else {
                        upgradeCost = property.price.upgrade
                          ? property.price.upgrade
                              .slice(0, Math.max(0, property.level - 1))
                              .reduce((a, b) => a + b, 0)
                          : 0;
                        totalInvested = property.price.buy + upgradeCost;
                      }

                      const buybackPrice = calculateBuybackPrice(property);
                      const isItemSelected = selected.includes(property.id);

                      return (
                        <TableRow
                          key={property.id}
                          hover
                          onClick={() => handleSelect(property.id)}
                          role="checkbox"
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                          </TableCell>
                          <TableCell>{property.id}</TableCell>
                          <TableCell>{property.name}</TableCell>
                          <TableCell align="center">{property.level}</TableCell>
                          <TableCell align="right">${totalInvested}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", color: "success.main" }}>
                            ${buybackPrice}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Summary */}
            {!loading && properties.length > 0 && (
              <Box sx={{ marginTop: 2, paddingTop: 2, borderTop: "1px solid #ddd" }}>
                <Typography variant="body1">
                  <strong>Selected Buyback Value:</strong> $
                  {properties
                    .filter(p => selected.includes(p.id))
                    .reduce((total, prop) => total + calculateBuybackPrice(prop), 0)
                    .toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Properties Value:</strong> $
                  {properties
                    .reduce((total, prop) => total + calculateBuybackPrice(prop), 0)
                    .toLocaleString()}
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Bankrupt;
