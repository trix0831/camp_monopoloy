import React, { useState } from "react";
import Header from "./components/Header";
import "./App.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ThemeProvider } from "@mui/material/styles";
import Home from "./components/Home";
import Notifications from "./components/Notifications";
import Teams from "./components/Teams/Teams";
import Properties from "./components/Properties/Properties";
import SellProperty from "./components/Properties/SellProperty";
import Login from "./components/Login";
import AddMoney from "./components/NPC/AddMoney";
import SetOwnership from "./components/NPC/SetOwnership";
import Transfer from "./components/NPC/Transfer";
import SetShopLevel from "./components/NPC/SetShopLevel";
import Support from "./components/NPC/Support";
import Event from "./components/admin/Event";
import Resources from "./components/NPC/Resources";
import Additional from "./components/admin/Additional";
import SetOccupation from "./components/admin/SetOccupation";
import Bank from "./components/admin/Bank";
import Bankrupt from "./components/admin/Bankrupt";
import PermissionDenied from "./components/PermissionDenied";
import Footer from "./components/Footer";
import RoleContext from "./components/useRole";
import Loading from "./components/Loading";
import BroadcastAlert from "./components/BroadcastAlert";
import Broadcast from "./components/admin/Broadcast";
import { roleIdMap } from "./components/Login";
import theme from "./theme";
import SetDice from "./components/NPC/SetDice";
import Map from "./components/Properties/Map";
import Random from "./components/NPC/Random";
import SetResources from "./components/admin/SetResources";
import Help from "./components/Help";
import ResourcesView from "./components/Teams/ResourcesView";
import BankTransfer from "./components/NPC/BankTransfer";
import Interest from "./components/admin/Interest";
// import SetPrices from "./components/admin/Resources";
// import Resource from "../../backend/models/resource";
// // import { socket, SocketContext } from "./websocket";

const App = () => {
  const localRole = localStorage.getItem("role");
  // console.log(localRole);
  const [navBarId, setNavBarId] = useState(0);
  const [role, setRole] = useState(localRole ? localRole : "");
  const [roleId, setRoleId] = useState(localRole ? roleIdMap[role] : 0);
  const [teams, setTeams] = useState([]);
  const [resources, setResources] = useState([]);
  const [phase, setPhase] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const value = {
    navBarId,
    setNavBarId,
    role,
    setRole,
    roleId,
    setRoleId,
    teams,
    setTeams,
    resources,
    setResources,
    phase,
    setPhase,
    buildings,
    setBuildings,
    filteredBuildings,
    setFilteredBuildings,
  };

  const location = useLocation();

  return (
    // <SocketContext.Provider value={socket}>
    <ThemeProvider theme={theme}>
      <RoleContext.Provider value={value}>
        <Header />
        <BroadcastAlert />
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            timeout={300}
            classNames="fade"
            unmountOnExit
            in={true}
            appear={true}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/help" element={<Help />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="teams" element={<Teams />} />
              <Route path="resourcesview" element={<ResourcesView />} />
              <Route path="properties" element={<Properties />} />
              <Route path="sellproperty" element={<SellProperty />} />
              <Route path="login" element={<Login />} />
              <Route path="addmoney" element={<AddMoney />} />
              <Route path="setownership" element={<SetOwnership />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="banktransfer" element={<BankTransfer />} />
              <Route path="setshop" element={<SetShopLevel />} />
              <Route path="random" element={<Random />} />
              <Route path="event" element={<Event />} />
              <Route path="resources" element={<Resources/>} />
              <Route path="additional" element={<Additional />} />
              <Route path="setoccupation" element={<SetOccupation />} />
              <Route path="permission" element={<PermissionDenied />} />
              <Route path="loading" element={<Loading />} />
              <Route path="interest" element={<Interest />} />
              <Route path="bank" element={<Bank />} />
              <Route path="bankrupt" element={<Bankrupt />} />
              <Route path="broadcast" element={<Broadcast />} />
              <Route path="setdice" element={<SetDice />} />
              <Route path="map" element={<Map />} />
              <Route path="setresources" element={<SetResources />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </RoleContext.Provider>
    </ThemeProvider>
    // </SocketContext.Provider>
  );
};

const Root = () => <BrowserRouter><App /></BrowserRouter>; // prettier-ignore

export default Root;
