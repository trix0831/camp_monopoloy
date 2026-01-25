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

const teams = [
  {
    id: 1,
    teamname: "1A",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 2,
    teamname: "1B",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 3,
    teamname: "2A",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 4,
    teamname: "2B",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 5,
    teamname: "3A",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 6,
    teamname: "3B",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 7,
    teamname: "4A",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 8,
    teamname: "4B",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 9,
    teamname: "5A",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 10,
    teamname: "5B",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 11,
    teamname: "6A",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 12,
    teamname: "6B",
    // occupation: "N/A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 13,
    teamname: "7A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 14,
    teamname: "7B",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 15,
    teamname: "8A",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
  {
    id: 16,
    teamname: "8B",
    money: 8000,
    loan: 0,
    propertyValue: 0,
  },
];

const lands = [
  { id: 1, type: "Store", name: "商店", description: "大買特買！", owner: 0},
  {
    id: 2,
    type: "Building",
    area: 1,
    name: "土地B1-企鵝村發明展示館",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  {
    id: 3,
    type: "Building",
    area: 1,
    name: "土地C1-企鵝村入口廣場",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  {
    id: 4,
    type: "Building",
    area: 1,
    name: "土地B2-則卷家",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  { id: 5, type: "Chance", name: "事件", description: "猜猜會發生甚麼事" , owner: 0},
  {
    id: 6,
    type: "Building",
    area: 1,
    name: "土地B3-尼可拉的秘密基地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  { id: 7, type: "Game", name: "遊戲1", description: "難道你是遊戲王！", owner: 0 },
  {
    id: 8,
    type: "Building",
    area: 1,
    name: "土地C2-企鵝村公車站",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  { id: 9, type: "Bank", name: "銀行", description: "錢錢錢！", owner: 0 },
  {
    id: 10,
    type: "Building",
    area: 1,
    name: "土地B4-外星人降落點",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  {
    id: 11,
    type: "Building",
    area: 1,
    name: "土地C3-企鵝村雜貨店",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  {
    id: 12,
    type: "Building",
    area: 1,
    name: "土地B5-企鵝村祭典會場",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  { id: 13, type: "Game", name: "紙飛機", description: "認真聽規則！", owner: 0 },
  {
    id: 14,
    type: "Building",
    area: 1,
    name: "土地A1-則卷家研究所",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 3000, upgrade: [1600, 1800, 2000, 2200]},
    rent: [1000, 1800, 2300, 2800, 3500],
  },
  { id: 15, type: "Jail", name: "監獄", description: "來跳團康舞吧！", owner: 0 },
  {
    id: 16,
    type: "Building",
    area: 1,
    name: "土地C4-企鵝咖啡廳",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  { id: 17, type: "Chance", name: "彩券行", description: "這一生，我搖身一變成為大富翁", owner: 0 },
  {
    id: 18,
    type: "Building",
    area: 1,
    name: "土地B6-企鵝村溫泉區",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  {
    id: 19,
    type: "Building",
    area: 1,
    name: "土地C5-企鵝村中學",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  { id: 20, type: "Game", name: "遊戲3", description: "認真聽規則！" , owner: 0},
  { id: 21, type: "Chance", name: "事件", description: "猜猜會發生甚麼事" , owner: 0},
  {
    id: 22,
    type: "Building",
    area: 1,
    name: "土地A2-時光機試驗場",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 3000, upgrade: [1600, 1800, 2000, 2200]},
    rent: [1000, 1800, 2300, 2800, 3500],
  },
  {
    id: 23,
    type: "Building",
    area: 1,
    name: "土地B7-企鵝村超級市場",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  {
    id: 24,
    type: "Building",
    area: 1,
    name: "土地C6-企鵝村小學",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  { id: 25, type: "Game", name: "遊戲4", description: "認真聽規則！", owner: 0 },
  {
    id: 26,
    type: "Building",
    area: 1,
    name: "土地B8-企鵝村機器人維修站",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 2200, upgrade: [1300, 1500, 1800, 2000] },
    rent: [700, 1500, 2000, 2300, 2800],
  },
  {
    id: 27,
    type: "Building",
    area: 1,
    name: "土地C7-博士試藥爆炸坑",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  {
    id: 28,
    type: "Building",
    area: 1,
    name: "土地C8-企鵝村運動場",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
  { id: 30, type: "Chance", name: "醫院", description: "你受傷了嗎", owner: 0 },
  { id: 31, type: "Game", name: "遊戲5", description: "認真聽規則！", owner: 0 },
  {
    id: 32,
    type: "Building",
    area: 1,
    name: "土地C9-山吹綠老師的家",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 1500, upgrade: [1000, 1200, 1400, 1600] },
    rent: [400, 900, 1400, 1800, 2500],
  },
];

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

const pairs = [
  {
    key: "currentEvent",
    value: 0,
  },
  {
    key: "lastNotificationId",
    value: 0,
  },
  {
    key: "hawkEyeTeam",
    value: 0,
  },
  {
    key: "phase",
    value: 1,
  },
];

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

  lands.forEach(async (ground) => {
    await new Land(ground).save();
  });
  console.log("lands created");

  teams.forEach(async (row) => {
    await new Team(row).save();
  });
  console.log("teams created");

  events.forEach(async (row) => {
    await new Event(row).save();
  });
  console.log("events created");

  pairs.forEach(async (row) => {
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
