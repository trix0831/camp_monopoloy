import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
import Team from "../models/team.js";
import Land from "../models/land.js";
import User from "../models/user.js";
import Resource from "../models/resource.js";
import Notification from "../models/notification.js";
import Broadcast from "../models/broadcast.js";
import Event from "../models/event.js";
import Pair from "../models/pair.js";
import Effect from "../models/effect.js";
import { initialTeams, initialLands, initialPairs } from "./gameData.js";

dotenv.config();
console.log(process.env.MONGO_URL);

const db = mongoose.connection;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  {
    username: "admin",
    password: "sunadmin",
  },
  {
    username: "NPC",
    password: "sunnpc",
  },
  {
    username: "1A",
    password: "monday",
  },
  {
    username: "1B",
    password: "happydog",
  },
  {
    username: "2A",
    password: "sadcat",
  },
  {
    username: "2B",
    password: "campisfun",
  },
  {
    username: "3A",
    password: "monkey",
  },
  {
    username: "3B",
    password: "panda",
  },
  {
    username: "4A",
    password: "fattiger",
  },
  {
    username: "4B",
    password: "adamwang",
  },
  {
    username: "5A",
    password: "bigjump",
  },
  {
    username: "5B",
    password: "givememoney",
  },
  {
    username: "6A",
    password: "hahaha",
  },
  {
    username: "6B",
    password: "password",
  },
  {
    username: "7A",
    password: "hungryasfuck",
  },
  {
    username: "7B",
    password: "iwanttorun",
  },
  {
    username: "8A",
    password: "letmego",
  },
  {
    username: "8B",
    password: "trix",
  },
];

// Teams and lands are imported from gameData.js (single source of truth shared with reset endpoint)

const events = [
  {
    id: 0,
    title: "無",
    description: "",
  },
  {
    id: 1,
    title: "反安倍三支箭",
    description:
      "銀行升息成30%",
  },
  {
    id: 2,
    title: "逃犯越獄",
    description: "獄卒氣憤不已，隨機抽取3支隊伍當替死鬼進監獄",
  },
  {
    id: 3,
    title: "馬斯克發廢文",
    description: "布萊德彼特幣暴跌",
  },
  {
    id: 4,
    title: "銀行倒閉，金融危機",
    description: "銀行倒了，裡面所有的錢都拿去修建銀行，這段期間銀行暫停所有功能",
  },
  {
    id: 5,
    title: "富翁掉錢",
    description: "特定幾格有放上現金，先走到先拿",
  },
  {
    id: 6,
    title: "男同俱樂部",
    description: "所有男隊輔進監獄，花6000元救回他們",
  },
  {
    id: 7,
    title: "納稅",
    description:
      "全隊上交手頭50%的現金",
  },
  {
    id: 8,
    title: "地震",
    description:
      "一棟房子扣5000",
  },
];

const notifications = [
  {
    id: 0,
    title: "歡迎遊玩大富翁",
    description: "衝啊",
    type: "temporary",
    duration: 1800,
    createdAt: 0,
  },
  // {
  //   id: 1,
  //   title: "Test temporary",
  //   description: "temporary",
  //   type: "temporary",
  //   duration: 10,
  //   createdAt: Date.now() / 1000,
  // },
];

// Pairs are imported from gameData.js

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("db connected");
  await Team.deleteMany({});
  await Land.deleteMany({});
  await User.deleteMany({});
  await Event.deleteMany({});
  await Pair.deleteMany({});
  await Notification.deleteMany({});
  await Effect.deleteMany({});
  await Broadcast.deleteMany({});
  console.log("delete done");

  users.forEach(async (user) => {
    await new User(user).save();
  });
  console.log("users created");

  initialLands.forEach(async (ground) => {
    await new Land(ground).save();
  });
  console.log("lands created");

  initialTeams.forEach(async (row) => {
    await new Team(row).save();
  });
  console.log("teams created");

  events.forEach(async (row) => {
    await new Event(row).save();
  });
  console.log("events created");

  initialPairs.forEach(async (row) => {
    await new Pair(row).save();
  });
  console.log("pairs created");

  notifications.forEach(async (row) => {
    await new Notification(row).save();
  });
  console.log("notifications created");

  // effects.forEach(async (row) => {
  //   await new Effect(row).save();
  // });
  // console.log("effects created");

  console.log("finish saving data");
});
