import { React, useState, useContext, useEffect, forwardRef} from "react";
import { Grid, Paper, Typography, Modal, Box, Button } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HouseIcon from "@mui/icons-material/House";
import RoleContext from "../useRole";
import axios from "../axios";

const colors = {
  Go: "rgb(0,0,0)",
  Building: {
    1: "rgb(255,102,102)",
    2: "rgb(255,204,153)",
    3: "rgb(255,255,153)",
    4: "rgb(204,255,153)",
    5: "rgb(153,255,255)",
    6: "rgb(194,163,195)",
  },
  Transport: "rgb(255,93,255)",
  Chance: "rgb(128,0,0)",
  Jail: "rgb(128,128,128)",
  Arena: "rgb(128,128,128)",
  Event: "rgb(0,0,0)",
  Store: "rgb(51,153,255)",
  Game: "rgb(25,73,128)",
  Random: "rgb(153,0,153)",
  Go: "rgb(247,207,0)",
  Bank: "rgb(180,247,141)",
};

const PropertyCard = forwardRef((props, ref) => {

  const {
    id,
    type,
    area,
    name,
    owner,
    hawkEye,
    description,
    level,
    expanded,
    price,
    rent,
    buffed,
  } = props;

  const [open, setOpen] = useState(false);
  const [buy, setBuy] = useState(0);
  const [upgrade, setUpgrade] = useState(0);
  const [teamName, setTeamName] = useState("");
  const { roleId } = useContext(RoleContext);

  useEffect(() => {
    if (owner && owner !== 0) {
      axios
        .get(`/team/${owner}`)
        .then((res) => {
          setTeamName(res.data.teamname);
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
          setTeamName(`Team ${owner}`);
        });
    }
  }, [owner]);

  const colorData = type === "Building" ? colors[type][area] : colors[type];
  let levelIcon = [];
  for (let i = 0; i < 5; i++) {
    if (i < level) {
      levelIcon.push(<HomeRoundedIcon style={{ color: "#63f74f" }} key={i} />);
    } else {
      levelIcon.push(
        <HomeRoundedIcon style={{ color: "rgb(160,160,160)" }} key={i} />
      );
    }
  }

  const handleView = () => {
    if (type === "Building") {
      setBuy(price.buy);
      setUpgrade(price.upgrade);
      setOpen(true);
    }
    console.log(price.buy);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper
        elevation={2}
        key={id}
        id={id}
        ref={ref}
        sx={{
          borderLeft: 10,
          borderColor: colorData,
          paddingTop: 0.5,
          paddingBottom: 0.5,
          minWidth: "100%",
        }}
        onClick={handleView}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6">{id}</Typography>
          </Grid>
          <Grid item xs>
            <Grid item>
              <Typography
                variant="h6"
                marginTop="1px"
                style={{
                  fontWeight: "600",
                  fontSize: "1.0rem",
                  color:
                    (buffed === 0 && type === "Building") || type !== "Building"
                      ? ""
                      : buffed === 1 && type === "Building"
                      ? "rgb(255,178,14)"
                      : buffed === 2 && type === "Building"
                      ? "rgb(194,0,0)"
                      : "",
                }}
              >
                {name}
              </Typography>
            </Grid>
            {type === "Building" || type === "SpecialBuilding" ? (
              <Grid item>
                <Typography variant="caption">
                  {owner === 0 ? <br /> : teamName}
                </Typography>
              </Grid>
            ) : (
              <Grid item>
                <Typography variant="caption">{description}</Typography>
              </Grid>
            )}
          </Grid>
          {type === "Building" && (
            <Grid
              item
              xs={5}
              display="flex"
              alignItems="center"
              justifyContent="right"
              paddingRight="5px"
            >
              {levelIcon}
            </Grid>
          )}
        </Grid>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 250,
            margin: 4,
            paddingLeft: 1,
            border: "solid 5px rgb(255,102,102)",
            borderRadius: "5px",
            backgroundColor: "rgb(255,253,236)",
            height: 250,
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 1000 }}
            >
              房產資訊
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "80%",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Typography
              id="modal-modal-description-1"
              sx={{ fontWeight: 700 }}
              component="h5"
            >
              {`地產名稱：${name}`}
            </Typography>
            <Typography
              id="modal-modal-description-2"
              sx={{ fontWeight: 700 }}
              component="h5"
            >
              {`地產持有人：${owner === 0 ? "無" : teamName}`}
            </Typography>
            <Typography
              id="modal-modal-description-2"
              sx={{ fontWeight: 700 }}
              component="h4"
            >
              {`地產花費： 購買 ${buy}  升級 ${upgrade} `}
            </Typography>
            <Typography
              id="modal-modal-description-2"
              sx={{ fontWeight: 700, fontSize: "0.9rem" }}
              component="h5"
            >
              {`過路費： 一星 ${rent[0]} 二星 ${rent[1]} 三星 ${rent[2]} 四星 ${rent[3]} 五星 ${rent[4]} `}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
});

export default PropertyCard;
