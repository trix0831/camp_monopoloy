import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VillaIcon from "@mui/icons-material/Villa";
import PaidIcon from "@mui/icons-material/Paid";
import BuildIcon from "@mui/icons-material/Build";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import EventIcon from "@mui/icons-material/Event";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MapIcon from "@mui/icons-material/Map";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CalculateIcon from '@mui/icons-material/Calculate';
import SavingsIcon from '@mui/icons-material/Savings';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

export const NavBarItems = [
  {
    id: 1,
    icon: <NotificationsIcon />,
    label: "Notifications",
    shortLabel: "Notifications",
    route: "notifications",
  },
  {
    id: 2,
    icon: <PeopleIcon />,
    label: "Teams",
    shortLabel: "Teams",
    route: "teams",
  },
  {
    id: 3,
    icon: <VillaIcon />,
    label: "Properties",
    shortLabel: "Properties",
    route: "properties",
  },
  {
    id: 4,
    icon: <MapIcon />,
    label: "Game Map",
    shortLabel: "Map",
    route: "map",
  },
  {
    id: 5,
    icon: <AutoGraphIcon />, //resource
    label: "ResourcesView",
    shortLabel: "ResourcesView",
    route: "resourcesView",
  }
  // {
  //   id: 11,
  //   icon: <AccountBalanceIcon />,
  //   label: "Bank",
  //   shortLabel: "Bank",
  //   route: "bank",
  // },
];

export const NPCItems = [
  {
    id: 6,
    icon: <PaidIcon />,
    label: "Add Money",
    shortLabel: "Money",
    route: "addmoney",
  },
  {
    id: 7,
    icon: <RequestQuoteIcon />,
    label: "Set Ownership",
    shortLabel: "Ownership",
    route: "setownership",
  },
  {
    id: 8,
    icon: <CurrencyExchangeIcon />,
    label: "Transfer",
    shortLabel: "Transfer",
    route: "transfer",
  },
  {
    id: 9,
    icon: <SavingsIcon />, 
    label: "Bank",
    shortLabel: "BankTransfer",
    route: "banktransfer",
  },
  // {
  //   id: 14,
  //   icon: <QuizIcon />,
  //   label: "Random",
  //   shortLabel: "Random",
  //   route: "random",
  // },
  {
    id: 10,
    icon: <AutoGraphIcon />, //resource
    label: "Resources",
    shortLabel: "Resources",
    route: "resources",
  }
];

export const adminItems = [
  {
    id: 11,
    icon: <EventIcon />,
    label: "Event / Phase",
    shortLabel: "Event",
    route: "event",
  },
  {
    id: 12,
    icon: <LocalAtmIcon />,
    label: "Interest",
    shortLabel: "Interest",
    route: "interest",
  },
  {
    id: 13,
    icon: <BuildIcon />,
    label: "Team Info",
    shortLabel: "Team",
    route: "teams",
  },
  {
    id: 14,
    icon: <PaidIcon />,
    label: "Bankrupt",
    shortLabel: "Bankrupt",
    route: "bankrupt",
  },
  {
    id: 15,
    icon: <VolumeUpIcon />,
    label: "Broadcast",
    shortLabel: "Broadcast",
    route: "broadcast",
  },
  {
    id: 16, 
    icon: <CalculateIcon />,
    label: "SetResources",
    shortLabel: "SetResources",
    route: "setresources",
  }
];

// export const Navigate = (path) => {
//   const { setNavBarId } = useContext(RoleContext);
//   const navigate = useNavigate();

//   const itemMap = {
//     ...NavBarItems,
//     ...NPCItems,
//     ...adminItems,
//   };
//   setNavBarId(itemMap.find((item) => item.route === path).id);

//   return () => navigate(path);
// };
