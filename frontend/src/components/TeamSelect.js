import React, { useState, useEffect } from "react";
import { InputLabel, Select, MenuItem } from "@mui/material";
import axios from "./axios";

const TeamSelect = ({ label, team, handleTeam, hasZero, sx }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/team");
        setTeams(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        value={team}
        labelId={label}
        onChange={(e) => {
          handleTeam(e.target.value);
        }}
        sx={sx}
        disabled={loading}
      >
        <MenuItem value={-1}>Select Team</MenuItem>
        {hasZero && <MenuItem value={0}>N/A</MenuItem>}
        {teams.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.teamname}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default TeamSelect;
