// Shared static game data — used by both initdata.js and the reset endpoint.
// Edit this file to change the canonical initial state of the game.

const A = {
  area: 1,
  price: { buy: 1500, upgrade: [1000, 1200, 1400] },
  rent: [400, 900, 1400, 1800],
};
const B = {
  area: 2,
  price: { buy: 2200, upgrade: [1300, 1500, 1800] },
  rent: [700, 1500, 2000, 2300],
};
const C = {
  area: 3,
  price: { buy: 3000, upgrade: [1600, 1800, 2000] },
  rent: [1000, 1800, 2300, 2800],
};

const building = (id, tier, name) => ({
  id,
  type: "Building",
  name,
  owner: 0,
  level: 0,
  buffed: 0,
  ...tier,
});

export const initialTeams = [
  { id: 1,  teamname: "1A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 2,  teamname: "1B", money: 8000, loan: 0, propertyValue: 0 },
  { id: 3,  teamname: "2A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 4,  teamname: "2B", money: 8000, loan: 0, propertyValue: 0 },
  { id: 5,  teamname: "3A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 6,  teamname: "3B", money: 8000, loan: 0, propertyValue: 0 },
  { id: 7,  teamname: "4A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 8,  teamname: "4B", money: 8000, loan: 0, propertyValue: 0 },
  { id: 9,  teamname: "5A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 10, teamname: "5B", money: 8000, loan: 0, propertyValue: 0 },
  { id: 11, teamname: "6A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 12, teamname: "6B", money: 8000, loan: 0, propertyValue: 0 },
  { id: 13, teamname: "7A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 14, teamname: "7B", money: 8000, loan: 0, propertyValue: 0 },
  { id: 15, teamname: "8A", money: 8000, loan: 0, propertyValue: 0 },
  { id: 16, teamname: "8B", money: 8000, loan: 0, propertyValue: 0 },
];

export const initialLands = [
  building(1, A, "魔法據點A1-碗櫥小閣樓"),
  { id: 2,  type: "Game",     name: "遊戲1",       description: "認真聽規則！",       owner: 0 },
  { id: 3,  type: "Candy",    name: "蜂蜜爵士甜點屋", description: "花100元買小糖果",   owner: 0 },
  building(4, C, "魔法據點C1-費格太太的客廳"),
  { id: 5,  type: "Store",    name: "貓頭鷹雜貨店", description: "購買道具卡",         owner: 0 },
  building(6, B, "魔法據點B1-煤油步道停車位"),
  { id: 7,  type: "Game",     name: "遊戲2",       description: "認真聽規則！",       owner: 0 },
  { id: 8,  type: "Chance",   name: "預言家日報",   description: "猜猜會發生甚麼事",   owner: 0 },
  building(9,  B, "魔法據點B2-水蠟樹街遊樂場"),
  building(10, B, "魔法據點B3-木蘭花新月街巷口"),
  building(11, A, "魔法據點A2-達力的第二間臥室"),
  { id: 12, type: "Game",     name: "遊戲3",       description: "認真聽規則！",       owner: 0 },
  building(13, C, "魔法據點C2-破釜酒吧臨時分部"),
  building(14, B, "魔法據點B4-木蘭花路公車站"),
  { id: 15, type: "Hospital", name: "聖蒙古療傷站", description: "健康檢查",           owner: 0 },
  building(16, A, "魔法據點A3-廚房大冰箱"),
  building(17, A, "魔法據點A4-威農姨丈的客廳"),
  { id: 18, type: "Game",     name: "遊戲4",       description: "認真聽規則！",       owner: 0 },
  { id: 19, type: "Jail",     name: "阿茲卡班監獄", description: "完成監獄任務",       owner: 0 },
  building(20, C, "魔法據點C3-騎士公車招呼站"),
  building(21, B, "魔法據點B5-社區垃圾分類場"),
  { id: 22, type: "Platform", name: "九又四分之三月台", description: "跳舞或唱營歌得1000元", owner: 0 },
  building(23, A, "魔法據點A5-水蠟樹街四號後花園"),
  { id: 24, type: "Chance",   name: "預言家日報",   description: "猜猜會發生甚麼事",   owner: 0 },
  building(25, C, "魔法據點C4-飛天汽車隱密車庫"),
  building(26, A, "魔法據點A6-德思禮家屋頂"),
  { id: 27, type: "Game",     name: "遊戲5",       description: "認真聽規則！",       owner: 0 },
  building(28, B, "魔法據點B6-隔壁鄰居的草皮"),
  { id: 29, type: "Store",    name: "貓頭鷹雜貨店", description: "購買道具卡",         owner: 0 },
  building(30, A, "魔法據點A7-煙囪壁爐口"),
  { id: 31, type: "Game",     name: "遊戲6",       description: "認真聽規則！",       owner: 0 },
  { id: 32, type: "Chance",   name: "預言家日報",   description: "猜猜會發生甚麼事",   owner: 0 },
  building(33, C, "魔法據點C5-鳳凰會秘密安全屋"),
  building(34, A, "魔法據點A8-儲藏室魔藥角"),
  { id: 35, type: "Bank",     name: "古靈閣銀行",   description: "路過得紅包2000元",   owner: 0 },
  building(36, B, "魔法據點B7-威農的鑽孔機工廠"),
];

export const initialPairs = [
  { key: "currentEvent",        value: 0 },
  { key: "lastNotificationId",  value: 0 },
  { key: "hawkEyeTeam",         value: 0 },
  { key: "phase",               value: 1 },
  { key: "acquisitionMultiplier", value: 3 },
];
