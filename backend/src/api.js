import express from "express";
import Team from "../models/team.js";
import Land from "../models/land.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import Event from "../models/event.js";
import Pair from "../models/pair.js";
import Effect from "../models/effect.js";
import Broadcast from "../models/broadcast.js";
import Resource from "../models/resource.js";
const router = express.Router();

const buffBuildings2 = async (building_1, building_2) => {
  for (let i = 0; i < 3; i++) {
    if (building_1.buffed !== 1) building_1.rent[i] *= 1.5;
    if (building_2.buffed !== 1) building_2.rent[i] *= 1.5;
  }
  building_1.buffed = 1;
  building_2.buffed = 1;
  await building_1.save();
  await building_2.save();
};

const debuffBuildings2 = async (building_1, building_2) => {
  building_1.buffed = 0;
  building_2.buffed = 0;
  for (let i = 0; i < 3; i++) {
    building_1.rent[i] /= 1.5;
    building_2.rent[i] /= 1.5;
  }

  await building_1.save();
  await building_2.save();
};

const buffBuildings3 = async (building_1, building_2, building_3) => {
  for (let i = 0; i < 3; i++) {
    if (building_1.buffed === 1) building_1.rent[i] /= 1.5;
    if (building_2.buffed === 1) building_2.rent[i] /= 1.5;
    if (building_3.buffed === 1) building_3.rent[i] /= 1.5;
    building_1.rent[i] *= 2;
    building_2.rent[i] *= 2;
    building_3.rent[i] *= 2;
  }
  building_1.buffed = 2;
  building_2.buffed = 2;
  building_3.buffed = 2;
  await building_1.save();
  await building_2.save();
  await building_3.save();
};

const debuffBuildings3 = async (building_1, building_2, building_3) => {
  building_1.buffed = 0;
  building_2.buffed = 0;
  building_3.buffed = 0;
  for (let i = 0; i < 3; i++) {
    building_1.rent[i] /= 2;
    building_2.rent[i] /= 2;
    building_3.rent[i] /= 2;
  }

  // await building_1.save();
  // await building_2.save();
  // await building_3.save();
};

const buffings2 = async (buildings, num1, num2) => {
  if (buildings[num1].owner === buildings[num2].owner) {
    console.log("0");
    buffBuildings2(buildings[num1], buildings[num2]);
  } else if (
    buildings[num1].buffed === 1 &&
    buildings[num1].owner !== buildings[num2].owner
  ) {
    debuffBuildings2(buildings[num1], buildings[num2]);
  }
};

const buffings3 = async (buildings, num1, num2, num3) => {
  if (
    buildings[num1].owner === buildings[num2].owner &&
    buildings[num2].owner === buildings[num3].owner
  ) {
    console.log("1");
    buffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
  } else if (
    buildings[num1].owner === buildings[num2].owner &&
    buildings[num2].owner !== buildings[num3].owner &&
    buildings[num1].owner !== 0
  ) {
    console.log("2");
    if (buildings[num1].buffed === 2) {
      debuffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
    }
    if (buildings[num3].buffed === 1) {
      buildings[num3].buffed = 0;
      for (let i = 0; i < 3; i++) {
        buildings[num3].rent[i] /= 1.5;
      }
    }
    buffBuildings2(buildings[num1], buildings[num2]);
    await buildings[num3].save();
  } else if (
    buildings[num2].owner === buildings[num3].owner &&
    buildings[num1].owner !== buildings[num2].owner &&
    buildings[num2].owner !== 0
  ) {
    console.log("3");
    if (buildings[num2].buffed === 2) {
      debuffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
    }
    if (buildings[num1].buffed === 1) {
      buildings[num1].buffed = 0;
      for (let i = 0; i < 3; i++) {
        buildings[num1].rent[i] /= 1.5;
      }
    }
    buffBuildings2(buildings[num2], buildings[num3]);
    await buildings[num1].save();
  } else if (
    buildings[num1].owner === buildings[num3].owner &&
    buildings[num2].owner !== buildings[num1].owner &&
    buildings[num1].owner !== 0
  ) {
    console.log("4");
    if (buildings[num1].buffed === 2) {
      debuffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
    }
    if (buildings[num2].buffed === 1) {
      buildings[num2].buffed = 0;
      for (let i = 0; i < 3; i++) {
        buildings[num2].rent[i] /= 1.5;
      }
    }
    buffBuildings2(buildings[num1], buildings[num3]);
    await buildings[num2].save();
  } else if (
    buildings[num1].owner !== buildings[num2].owner &&
    buildings[num2].owner !== buildings[num3].owner
  ) {
    console.log("5");
    if (buildings[num1].buffed === 1 && buildings[num2].buffed === 1) {
      debuffBuildings2(buildings[num1], buildings[num2]);
    } else if (buildings[num2].buffed === 1 && buildings[num3].buffed === 1) {
      debuffBuildings2(buildings[num2], buildings[num3]);
    } else if (buildings[num1].buffed === 1 && buildings[num3].buffed === 1) {
      debuffBuildings2(buildings[num1], buildings[num3]);
    }
  }
};

router.get("/", (req, res) => {
  res.json({ a: 1, b: 2 });
});

async function updateTeam(team, moneyChanged, io, saved) {
  const teamObj = await Team.findOne({ id: team });
  var ratio = 1;
  let final = Math.round(teamObj.money + moneyChanged * ratio);
  if (saved && final < 0) {
    const message = {
      title: "破產!!!",
      description: teamObj.teamname,
      level: 0,
      createdAt: Date.now(),
    };
    await new Broadcast(message).save();
    io.emit("broadcast", message);
  }
  if (saved) {
    const temp = await Team.findOneAndUpdate(
      { id: team },
      { money: final },
      { new: true } //return the item after update
    );
    return temp;
  } else {
    return { money: final };
  }
}

async function deleteTimeoutNotification() {
  const notifications = await Notification.find();
  const time = Date.now() / 1000;
  for (let i = 0; i < notifications.length; i++) {
    if (
      notifications[i].createdAt + notifications[i].duration < time &&
      notifications[i].duration > 0
    ) {
      await Notification.findByIdAndDelete(notifications[i]._id);
    }
  }
}

router.get("/team", async (req, res) => {
  const teams = await Team.find().sort({ teamname: 1 });
  res.json(teams).status(200);
});

router.get("/teamRich", async (req, res) => {
  const teams = await Team.find().sort({ money: -1 });
  const team = teams[0];
  console.log(team);
  res.json(team).status(200);
});

router.post("/checkPropertyCost", async (req, res) => {
  const { team, building, mode } = req.body;

  const targetBuilding = await Land.find({ id: building });
  const targetTeam = await Team.find({ id: team });
  const surplus = targetTeam[0].money;
  if (mode === "Buy") {
    const checkPropertyCost = targetBuilding[0].price.buy;
    if (surplus >= checkPropertyCost) res.json({ message: "OK" }).status(200);
    else {
      res.json({ message: "FUCK" }).status(200);
    }
  } else if (mode === "Upgrade") {
    const checkPropertyCost = targetBuilding[0].price.upgrade;
    console.log(checkPropertyCost);
    if (surplus >= checkPropertyCost) res.json({ message: "OK" }).status(200);
    else res.json({ message: "FUCK" }).status(200);
  }
});

router.get("/team/:teamId", async (req, res) => {
  const team = await Team.findOne({ id: req.params.teamId });
  res.json(team).status(200);
});

router.get("/land", async (req, res) => {
  const lands = await Land.find().sort({ id: 1 });
  res.json(lands).status(200);
});

router.get("/land/:id", async (req, res) => {
  const land = await Land.findOne({ id: req.params.id });
  res.json(land).status(200);
});

router.get("/property/:teamId", async (req, res) => {
  const properties = await Land.find({ owner: req.params.teamId });
  res.json(properties).status(200);
});

router.post("/set", async (req, res) => {
  const { id, amount } = req.body;
  await Team.findOneAndUpdate({ id: parseInt(id) }, { money: amount });
  res.json({ success: true }).status(200);
});

router.get("/getRent", async (req, res) => {
  const building = req.query.building;
  if (building !== -1) {
    const targetBuilding = await Land.find({ id: building });
    const rent = targetBuilding[0].rent[targetBuilding[0].level - 1];
    res.json(rent).status(200);
  }
  res.json(0).status(200);
});

// router.get("/resourceInfo", async (req, res) => {
//   const resources = await Resource.find().sort({ id: 1 });
//   res.json(resources).status(200);
// });

router.get('/resourceInfo', async (req, res) => {
  const resources = await Resource.find().sort({ id: 1 });
  res.json(resources).status(200);
});

router.get("/resourceName", async (req, res) => {
  try {
    const resources = await Resource.find();
    const resourcesName = resources.map(resource => resource.name);
    res.json(resourcesName);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/resourcePrice", async (req, res) => {
  try {
    const resources = await Resource.find();
    const resourcesPrice = resources.map(resource => resource.price);
    res.json(resourcesPrice);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/controlResource", async (req, res) => {
  const { teamId, resourceId, number, mode } = req.body;
  const team = await Team.collection.findOne({ id: teamId });

  if (mode === 0) {//-
    if(resourceId == 0){ //布萊德彼特幣
      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: {eecoin : Number(team.resources.eecoin) - Number(number)},
        }
      );
    }
  } else if (mode === 1) {//+
    if(resourceId == 0){//布萊德彼特幣
      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: { eecoin: Number(team.resources.eecoin) + Number(number) },
        }
      );
    }
  }
  
  res.json("Success").status(200);
});

router.post("/updateResourcePrice", async (req, res) => {
  const {resourceId, price} = req.body;

  await Resource.findOneAndUpdate(
    { id: resourceId },
    { 
      price : price
    }
  );

  res.json("Success").status(200);
});


router.post("/sellResource", async (req, res) => {
  const { teamId, resourceId, number, mode } = req.body;
  const team = await Team.collection.findOne({ id: teamId });
  const resource = await Resource.collection.findOne({ id: resourceId });

  if (mode === 0) {//sell
    if(resourceId == 0){ //eecoin
      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: {eecoin : team.resources.eecoin - number},
          money: team.money + resource.price * number
        }
      );
    }
  } else if (mode === 1) {//buy
    if(resourceId == 0){//eecoin
      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: {eecoin: Number(team.resources.eecoin) + Number(number) },
          money: team.money - resource.price * number,
        }
      );
    }
  }
  
  res.json("Success").status(200);
});

router.post("/percent", async (req, res) => {
  try {
    // Fetch all teams
    const teams = await Team.find();

    // Update each team's money by reducing it by 30%
    teams.forEach(async (team) => {
      team.money = team.money * 0.7; // Reduce money by 30%
      await team.save(); // Save the updated team
    });

    res.status(200).json({ message: "Money reduced by 30% for all teams" });
  } catch (err) {
    console.error("Error reducing money:", err);
    res.status(500).json({ message: "Failed to reduce money for teams" });
  }
});

router.post("/cutResource", async (req, res) => {
  console.log("hello");
  try {
    // Fetch all teams
    const teams = await Team.find();

    // Update each team's money by reducing it by 30%
    teams.forEach(async (team) => {
      console.log(team.resources.eecoin);
      team.resources.eecoin = math.round(team.resources.eecoin * 0.5); 
      team.resources.love = math.round(team.resources.love * 0.5); 
      await team.save(); // Save the updated team
    });

    res.status(200).json({ message: "Resources reduced by 50% for all teams" });
  } catch (err) {
    console.error("Error reducing resources:", err);
    res.status(500).json({ message: "Failed to reduce resource for teams" });
  }
});


router.post("/sell", async (req, res) => {
  const { teamId, landId, forced } = req.body;
  const land = await Land.findOne({ id: landId });
  if (land.owner !== teamId && teamId < 10) {
    res.status(400).json({ error: "Not your land" });
    return;
  }
  const team = await Team.findOne({ id: land.owner });

  const price = calcSellPrice(land, forced);
  // team.money += price;
  // await team.save();
  await updateTeam(land.owner, price, req.io, true);
  await Land.findOneAndUpdate({ id: landId }, { owner: 0, level: 0 });
  res.status(200).json({ message: "Sell successful" });
});

router.post("/bankTransfer", async (req, res) => {
  const {targetTeam, dollar} = req.body;
  const team = await Team.findOne({
    id: targetTeam
  });

  team.money -= dollar;
  team.bank += dollar;
  await team.save();

  res.json("Success").status(200);
});

router.post ("/bankControl", async (req, res) => {
  const {targetTeam, dollar} = req.body;
  const team = await Team.findOne({
    id: targetTeam
  });

  team.bank += dollar;
  await team.save();

  res.json("Success").status(200);
});

router.post("/interest", async(req, res) => {
  const {rate} = req.body;
  const teams = await Team.find();

  for (let i = 0; i < teams.length; i++) {
    teams[i].bank = Math.round(teams[i].bank * Number(rate));
    await teams[i].save();

    console.log(`team ${teams[i].teamname} bank: ${teams[i].bank}`);
  }

  res.json("Success").status(200);
});

router.get("/allEvents", async (req, res) => {
  const events = await Event.find().sort({ id: 1 });
  res.json(events).status(200);
});

router.post("/reset", async(req, res) =>{
  console.log("RESET");

  //reset everything
  const teams = await Team.find();
  const resources = await Resource.find();

  for(let i = 0; i < teams.length; i++) {
    teams[i].money = 8000;
    teams[i].loan = 0;
    teams[i].propertyValue = 0;
    await teams[i].save();
  }


  const lands = await Land.find();
  //set all lands to 0
  for(let i = 0; i < lands.length; i++) {
    lands[i].owner = 0;
    lands[i].level = 0;
    await lands[i].save();
  }
})

router
  .post("/event", async (req, res) => {
    const { id } = req.body;
    const teams = await Team.find();
    const pair = await Pair.findOne({ key: "currentEvent" });
    if (pair) {
      const currentEvent = parseInt(pair.value);
      let note = "";

      for (let i = 0; i < teams.length; i++) {
        teams[i].deposit = Math.round(teams[i].deposit * 0.15) * 10;
        await teams[i].save();
      }
      switch (id) {
        default: 
          res.json("Success").status(200);
          break;
        case 1: // 山賊入侵，各組金錢減少30%。
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(15000);
            //save the update
            await resources[0].save();

            console.log("event 1");

            res.json("Success").status(200);
          }
          break;

        case 2:
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(30000);
            await resources[0].save();

            res.json("Success").status(200);
          }
          break;

        case 3:
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(1000);
            await resources[0].save();

            res.json("Success").status(200);
          }
          break;

        case 4:
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(2000);
            await resources[0].save();

            const teams = await Team.find();

            for(let i = 0; i < teams.length; i++) {
              teams[i].bank = 0;
              await teams[i].save();
            }

            res.json("Success").status(200);
          }
          break;

        case 5:
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(3000);
            await resources[0].save();

            res.json("Success").status(200);
          }
          break;

        case 6: // 屠魔令，所有資源減少50%
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(18000);
            await resources[0].save();

            res.json("Success").status(200);
          }
          break;
        case 7:
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(16000);
            await resources[0].save();

            const teams = await Team.find();

            for (let i = 0; i < teams.length; i++) {
              teams[i].money = Math.round(teams[i].money * 0.5);
              await teams[i].save();
            }

            res.json("Success").status(200);
          }
          break;
        case 8:
          {
            const resources = await Resource.find();
            //update all resources price
            resources[0].price = Number(1000);
            await resources[0].save();

            //For each land the team owns, reduce the money by 5000
            const lands = await Land.find();
            for (let i = 0; i < lands.length; i++) {
              console.log(`land ${lands[i].id} owner: ${lands[i].owner}`);

              if (lands[i].owner !== 0 && lands[i].level > 1) {
                const team = await Team.findOne({ id: lands[i].owner });
                team.money -= 5000 * (lands[i].level - 1);
                await team.save();
              }
            }

            res.json("Success").status(200);
          }
          break;
        // case 3: // 來幫臺灣衝經濟嘍, 每個小隊普發$10000。
        //   {
        //     const teams = await Team.find();
        //     for (let i = 0; i < teams.length; i++) {
        //       teams[i].money += 10000;
        //       await teams[i].save();
        //     }
        //     res.json("Success").status(200);
        //   }
        //   break;
        // case 5:
        //   {
        //     // 我們還能不能能不能再見面？戀愛腦的你向佛祖發誓，為了愛情你可以放棄一切, 於是向佛祖捐獻30%現金+任意一張卡片，以示誠心。
        //     const teams = await Team.find();
        //     for (let i = 0; i < teams.length; i++) {
        //       teams[i].money = Math.round(teams[i].money * 0.07) * 10;
        //       await teams[i].save();
        //     }
        //     res.json("Success").status(200);
        //   }
        //   break;
        // case 8: //卡努颱風襲擊, 舟山河泛濫成災, 編號12至34的房子數量-1。房產等級1的地產不受影響
        //   {
        //     const lands = await (
        //       await Land.find()
        //     ).filter(
        //       (land) =>
        //         land.type === "Building" &&
        //         land.level > 1 &&
        //         land.id >= 12 &&
        //         land.id <= 34
        //     );
        //     for (let i = 0; i < lands.length; i++) {
        //       lands[i].level -= 1;
        //       await lands[i].save();
        //     }
        //     res.json("Success").status(200);
        //   }
        //   break;
        // case 10: // 獲得歷史線索, 獲得現金15000 + 一項隱藏成就的敘述
        //   {
        //     const teams = await Team.find();
        //     for (let i = 0; i < teams.length; i++) {
        //       teams[i].money += 15000;
        //       await teams[i].save();
        //     }
        //     res.json("Success").status(200);
        //   }
        //   break;

        // case 12: // 仇富心態爆發, 現金前2的小隊入獄 + 扣除其40%的現金, 並將其數額平分給剩下8個小隊
        //   {
        //     const teams = await Team.find().sort({ money: -1 });
        //     const money1 = Math.round(teams[0].money * 0.04) * 10;
        //     const money2 = Math.round(teams[1].money * 0.04) * 10;
        //     let moneyAdd = Math.round((money1 + money2) / 80) * 10;
        //     for (let i = 0; i < teams.length; i++) {
        //       if (i === 0) {
        //         teams[i].money -= money1;
        //       } else if (i === 1) {
        //         teams[i].money -= money2;
        //       } else {
        //         teams[i].money += moneyAdd;
        //       }
        //       await teams[i].save();
        //     }

        //     note = `${teams[0].teamname}、${teams[1].teamname}入獄！`;
        //     res.json(note).status(200);
        //   }
        //   break;
        // case 13:
        //   {
        //     // 各隊扣除「擁有的房子數量*2000」 的現金
        //     const teams = await Team.find().sort({ id: 1 });
        //     for (let i = 0; i < teams.length; i++) {
        //       const lands = await Land.find({ owner: teams[i].id });
        //       let total = 0;
        //       for (let j = 0; j < lands.length; j++) {
        //         total += lands[j].level;
        //       }
        //       console.log(`total: ${total}`);
        //       teams[i].money -= total * 2000;
        //       await teams[i].save();
        //     }
        //     res.json("Success").status(200);
        //   }
        //   break;

        // case 15: // 將所有現金不足20000的小隊補至20000
        //   {
        //     const teams = await Team.find();
        //     for (let i = 0; i < teams.length; i++) {
        //       if (teams[i].money < 20000) {
        //         teams[i].money = 20000;
        //       }
        //       teams[i].save();
        //     }
        //     res.json("Success").status(200);
        //   }
        //   break;
      }
      pair.value = id;
      await pair.save();

      const newEvent = await Event.findOne({ id });
      newEvent.note = note;
      newEvent.level = 0;
      await newEvent.save();
      // await new Notification(newEvent).save();
      // console.log(newEvent);
      req.io.emit("broadcast", newEvent);
      console.log("broadcast");
    } else {
      res.json("Failed").status(403);
    }
  })
  .get("/event", async (req, res) => {
    const pair = await Pair.findOne({ key: "currentEvent" });
    const event = await Event.findOne({ id: pair.value });
    res.json(event).status(200);
  });

router
  .post("/add", async (req, res) => {
    const { id, dollar } = req.body;
    const team = await Team.findAndCheckValid(id);
    if (!team) {
      res.status(403).send();
      console.log("Team not found");
      return;
    }

    await updateTeam(id, dollar, req.io, true);

    res.status(200).send("Update succeeded");
  })
  .get("/add", async (req, res) => {
    console.log(req.query);
    const { id, dollar } = req.query;
    console.log(id, dollar);
    const data = await updateTeam(id, dollar, req.io, false);
    console.log(data);
    res.json(data).status(200);
  });

router.post("/series", async (req, res) => {
  const { teamId, area } = req.body;
  const count = await (
    await Land.find({ area, owner: teamId })
  ).filter((land) => land.owner > 0).length;
  res.json({ count }).status(200);
});

router.post("/soldout", async (req, res) => {
  const { id, buildings, building } = req.body;
  const buildingsToSell = Array.isArray(buildings) ? buildings : [building || buildings];
  
  const team = await Team.findOne({ id: parseInt(id) });
  if (!team) return res.status(404).json("Team not found");

  let totalMoneyGained = 0;
  let totalPropertyValueLost = 0;

  for (const buildingId of buildingsToSell) {
    if (buildingId === undefined || buildingId === null) continue;
    const land = await Land.findOne({ id: parseInt(buildingId) });
    if (!land || land.owner !== parseInt(id)) continue;

    const totalBuyPrice = land.price.buy;
    const upgradeCost = (land.price.upgrade && Array.isArray(land.price.upgrade))
      ? land.price.upgrade.slice(0, Math.max(0, land.level - 1)).reduce((a, b) => a + b, 0)
      : 0;
    const totalInvested = totalBuyPrice + upgradeCost;
    const buybackPrice = Math.round(totalInvested * 0.6);

    totalMoneyGained += buybackPrice;
    totalPropertyValueLost += totalInvested;

    land.level = 0;
    land.owner = 0;
    land.buffed = 0;
    await land.save();
  }

  team.money += totalMoneyGained;
  team.propertyValue = Math.max(0, team.propertyValue - totalPropertyValueLost);
  await team.save();

  res.json("Success").status(200);
});

router.post("/deposit", async (req, res) => {
  const { id, dollar } = req.body;
  const team = await Team.find({ id: id });
  team[0].money -= dollar;
  team[0].deposit += dollar;
  await team[0].save();
  res.json("Success").status(200);
});

router.post("/accounting", async (req, res) => {
  const teams = await Team.find().sort({ id: 1 });
  for (let i = 0; i < teams.length; i++) {
    const lands = await Land.find({ owner: teams[i].id });
    let total = 0;
    for (let i = 0; i < lands.length; i++) {
      total +=
        (lands[i].price.buy + lands[i].price.upgrade * (lands[i].level - 1)) *
        0.9;
    }
    if (teams[i].deposit >= 0) teams[i].money += total + teams[i].deposit;
    else teams[i].money += total + teams[i].deposit * 1.3;

    teams[i].deposit = 0;
    await teams[i].save();
  }
  res.json("Success").status(200);
});

router.post("/rob", async (req, res) => {
  const { id } = req.body;
  const team = await Team.find({ id: id });
  const teams = await Team.find().sort({ money: 1 });
  const lands = await Land.find({ owner: teams[0].id, level: 1 });

  if (lands.length === 0) {
    req.io.emit("broadcast", {
      title: "趁火打劫發動",
      description: `${team[0].teamname}使用了趁火打劫，但${teams[0].teamname}逃過一劫...`,
    });
  } else {
    const index = Math.floor(Math.random() * lands.length);
    lands[index].owner = id;
    await lands[index].save();
    req.io.emit("broadcast", {
      title: "趁火打劫發動",
      description: `${team[0].teamname}使用了趁火打劫, 搶走${teams[0].teamname}的${lands[index].name}, 2ㄏ2ㄏ`,
    });
    res.json({ building: lands[index].id }).status(200);
  }
});

router.post("/equility", async (req, res) => {
  const { id } = req.body;
  const team = await Team.find({ id: id });
  const teams = await Team.find().sort({ money: 1 });
  let order = -1;
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].id === id) order = i;
  }
  if (order + 1 === teams.length) {
    team[0].money -= 10000;
    await team[0].save();
    req.io.emit("broadcast", {
      title: "實質平等發動",
      description: `${team[0].teamname}使用了實質平等, 但你太有錢了, 扣除10000元`,
    });
  } else {
    const money =
      Math.round((teams[order].money + teams[order + 1].money) * 0.05) * 10;

    teams[order].money = money;
    teams[order + 1].money = money;
    await teams[order].save();
    await teams[order + 1].save();
    req.io.emit("broadcast", {
      title: "實質平等發動",
      description: `${team[0].teamname}使用了實質平等, 與${
        teams[order + 1].teamname
      }平分金錢`,
    });
  }
  res.json("Success").status(200);
});

router.post("/handleBuff1", async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const land = await Land.find({ name: name });
  land[0].buffed = 1;
  for (let i = 0; i < 3; i++) {
    land[0].rent[i] *= 1.5;
  }
  await land[0].save();
  res.json("Success").status(200);
});

router.post("/handleBuff2", async (req, res) => {
  const { name } = req.body;
  const land = await Land.find({ name: name });
  land[0].buffed = 2;
  for (let i = 0; i < 3; i++) {
    land[0].rent[i] *= 2;
  }
  await land[0].save();
  res.json("Success").status(200);
});

router.post("/handleDeBuff", async (req, res) => {
  const { name } = req.body;
  const land = await Land.find({ name: name });
  const originstatus = land[0].buffed;
  land[0].buffed = 0;
  for (let i = 0; i < 3; i++) {
    if (originstatus === 1) land[0].rent[i] /= 1.5;
    else if (originstatus === 2) land[0].rent[i] /= 2;
  }
  await land[0].save();
  res.json("Success").status(200);
});

const calcTransfer = async (from, to, amount, isEstate) => {
  if (from === to) return null;

  const FromTeam = await Team.findOne({ id: from }); //minus
  const ToTeam = await Team.findOne({ id: to }); //add
  if (!FromTeam || !ToTeam) {
    console.log("error finding teams in func: calcTransfer");
    return null;
  }

  var FromAmount = parseInt(FromTeam.money);
  var ToAmount = parseInt(ToTeam.money);
  var TransferAmount = parseInt(amount);
  
  ToAmount += TransferAmount;
  FromAmount -= TransferAmount;
  console.log({ from: FromAmount, to: ToAmount });
  return { from: FromAmount, to: ToAmount };
};

router.post("/transfer", async (req, res) => {
  const { from, to, IsEstate, dollar } = req.body;
  //update team status
  await Team.findAndCheckValid(from);
  await Team.findAndCheckValid(to);

  const data = await calcTransfer(from, to, dollar, IsEstate);
  if (!data) {
    console.log("Transfer failed");
    res.status(403).send("Transfer failed");
  } else {
    await Team.findOneAndUpdate({ id: from }, { money: data.from });
    await Team.findOneAndUpdate({ id: to }, { money: data.to });
    res.status(200).send("Update succeeded");
    console.log("success");
  }
  console.log("in transfer");
});

router.get("/transfer", async (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let IsEstate = req.query.IsEstate;
  let dollar = req.query.dollar;
  const data = await calcTransfer(from, to, dollar, IsEstate);
  console.log(data);
  if (data !== null) res.json(data).status(200);
  else res.status(403).send();
});

// async function updateHawkEye() {
//   const { value: hawkEyeTeam } = await Pair.findOne({ key: "hawkEyeTeam" });
//   if (hawkEyeTeam === 0) return;
//   // may delete some building need to clear and fill(?)
//   for (let i = 1; i <= 40; i++) {
//     await Land.findOneAndUpdate({ id: i }, { hawkEye: 0 });
//   }
//   const hawkEyeBuildings = await Land.find({ owner: hawkEyeTeam });
//   console.log(hawkEyeBuildings);
//   for (let i = 0; i < hawkEyeBuildings.length; i++) {
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id - 1 },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id + 1 },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//   }
//   for (let i = 0; i < hawkEyeBuildings.length; i++) {
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//   }
//   console.log("hawkEye updated");
// }

// Helper function to calculate net value based on level
const calculateNetValue = (buyPrice, upgradePrices, level) => {
  if (level === 0) return 0;
  let total = buyPrice; // Level 1 costs buyPrice
  for (let i = 1; i < level; i++) {
    total += upgradePrices[i - 1]; // Level i+1 costs upgradePrices[i-1]
  }
  return total;
};

router.post("/ownership", async (req, res) => {
  const { teamId, land, level } = req.body;
  
  // Get the current land state before updating
  const currentLand = await Land.findOne({ name: land });
  if (!currentLand) {
    res.status(403).send();
    console.log("Land not found");
    return;
  }

  const oldOwner = currentLand.owner;
  const oldLevel = currentLand.level;
  const buyPrice = currentLand.price.buy;
  const upgradePrices = currentLand.price.upgrade;

  // Calculate net values based on actual level costs
  const oldNetValue = calculateNetValue(buyPrice, upgradePrices, oldLevel);
  const newNetValue = calculateNetValue(buyPrice, upgradePrices, level);

  if (level > 0) {
    const tmp1 = await Land.findOneAndUpdate({ name: land }, { owner: teamId });
    if (!tmp1) {
      res.status(403).send();
      console.log("Update failed");
      return;
    }
  }else{
    const tmp1 = await Land.findOneAndUpdate({ name: land }, { owner: 0 });
    if (!tmp1) {
      res.status(403).send();
      console.log("Update failed");
      return;
    }
  }


  const tmp2 = await Land.findOneAndUpdate({ name: land }, { level: level });
  if (!tmp2) {
    res.status(403).send();
    console.log("Update failed");
    return;
  }

  // Handle the net value problem
  if (oldOwner !== teamId) {
    // Different owner: remove old net value from old owner, add new net value to new owner
    if (oldOwner !== 0) { // 0 means NPC/no owner
      const oldOwnerTeam = await Team.findOne({ id: oldOwner });
      if (oldOwnerTeam) {
        oldOwnerTeam.propertyValue -= oldNetValue;
        await oldOwnerTeam.save();
      }
    }

    // Only add new net value if property is not removed (level > 0)
    if (level > 0) {
      const newOwnerTeam = await Team.findOne({ id: teamId });
      if (newOwnerTeam) {
        newOwnerTeam.propertyValue += newNetValue;
        await newOwnerTeam.save();
      }
    }
  } else {
    // Same owner: adjust net value based on level change
    const ownerTeam = await Team.findOne({ id: teamId });
    if (ownerTeam) {
      const netValueDifference = newNetValue - oldNetValue;
      ownerTeam.propertyValue += netValueDifference;
      await ownerTeam.save();
    }
  }

  res.status(200).send("update succeeded");
});

router.post("/npcOwnership", async (req, res) => {
  const { teamId, landId, moneyPaid } = req.body;
  const tmp1 = await Land.findOneAndUpdate({ id: landId }, { owner: teamId });
  if (!tmp1) {
    res.status(403).send();
    console.log("Update failed 1");
    return;
  }
  const prev_level = tmp1.level;
  const tmp2 = await Land.findOneAndUpdate({ id: landId }, { level: prev_level+1 });
  if (!tmp2) {
    res.status(403).send();
    console.log("Update failed 2");
    return;
  }

  // handle netvalue
  const team = await Team.findOne({ id: teamId });
  team.propertyValue -= moneyPaid;
  await team.save();

  res.status(200).send("update succeeded");
});

router.post("/aquire", async (req, res) => {
  const { land, teamId } = req.body;
  const target = await Land.find({ name: land });
  const originOwner = target[0].owner;
  const originTeam = await Team.find({ id: originOwner });
  const newTeam = await Team.find({ id: teamId });
  originTeam[0].money +=
    target[0].price.buy + (target[0].level - 1) * target[0].price.upgrade;
  newTeam[0].money -=
    target[0].price.buy + (target[0].level - 1) * target[0].price.upgrade;
  target[0].owner = teamId;

  await originTeam[0].save();
  await newTeam[0].save();
  await target[0].save();
  res.json("Success").status(200);
});

router.get("/aquireBuilding", async (req, res) => {
  const targetBuilding = Land.find({ type: "Building" }).sort({ id: 1 });
  res.json(targetBuilding).status(200);
});

router.post("/exchange", async (req, res) => {
  const { land, otherLand, teamId, otherTeamId } = req.body;
  const land_1 = await Land.find({ name: land });
  const land_2 = await Land.find({ name: otherLand });
  land_1[0].owner = otherTeamId;
  land_2[0].owner = teamId;
  await land_1[0].save();
  await land_2[0].save();
  res.json("Success").status(200);
});

router.post("/shipRepair", async (req, res) => {
  const { teamId } = req.body;
  console.log(teamId);
  const team = await Team.find({ id: teamId });
  team[0].dice = 2;
  await team[0].save();
  res.json("Success").status(200);
});

router.get("/allEffects", async (req, res) => {
  const effects = await Effect.find({}).sort({ id: 1 });
  res.json(effects).status(200);
});

router.post("/effect", async (req, res) => {
  const { teamname, title } = req.body;
  const effect = await Effect.findOne({ title });
  if (!effect) {
    res.status(403).send();
    console.log("Effect not found");
    return;
  }
  const { id, description, trait, duration, bonus } = effect;
  const team = await Team.findOne({ teamname });
  const time = Date.now() / 1000;
  if (!team) {
    res.status(403).send("Team not found");
    console.log("Team not found");
    return;
  }
  if (bonus !== -1) {
    team.bonus = { value: bonus, duration, time };
  }
  if (id === 4) {
    // soulgem
    team.soulgem = { value: true, duration, time };
  }

  const pair = await Pair.findOne({ key: "lastNotificationId" });
  const type = trait ? "temporary" : "permanent";
  const notification = {
    id: pair.value,
    type,
    teamname,
    title,
    description: `${teamname}: ${description}`,
    duration,
    createdAt: time,
  };
  // await deleteTimeoutNotification();
  // save
  console.log(notification);
  await new Notification(notification).save();
  await team.save();
  req.io.emit("broadcast", notification);
  res.status(200).send("Update succeeded");
});

router
  .post("/broadcast", async (req, res) => {
    const { title, description, level } = req.body;
    let time = Date.now();
    const broadcast = {
      createdAt: time,
      title: title,
      description: description,
      level: level,
    };
    await new Broadcast(broadcast).save();
    req.io.emit("broadcast", { title, description, level });
    res.status(200).send("Broadcast succeeded");
    console.log("broadcast sent");
  })
  .get("/broadcast", async (req, res) => {
    const data = await Broadcast.find({}).sort({ createdAt: -1 });
    res.json(data).status(200);
  })
  .delete("/broadcast/:createdAt", async (req, res) => {
    const { createdAt } = req.params;
    const data = await Broadcast.findOneAndDelete({ createdAt });
    res.json(data).status(200);
  });

router.get("/notifications", async (req, res) => {
  await deleteTimeoutNotification();
  // save
  const newNotifications = await Notification.find();
  res.json(newNotifications).status(200);
});

// router.post("/bonus", async (req, res) => {
//   console.log(req.body);
//   const { teamname, bonus, duration } = req.body;
//   const time = Date.now() / 1000;
//   const team = await Team.findOneAndUpdate(
//     { teamname: teamname },
//     { bonus: { value: bonus, time: time, duration: duration } }
//   );
//   if (!team) {
//     res.status(403).send();
//     console.log("Update failed");
//     return;
//   }
//   res.status(200).send("update succeeded");
// });

// router.post("/soulgem", async (req, res) => {
//   const { teamname } = req.body;
//   const time = Date.now() / 1000;
//   const team = await Team.findOneAndUpdate(
//     { teamname: teamname },
//     { soulgem: { value: true, time: time } }
//   );
//   if (!team) {
//     res.status(403).send();
//     console.log("Update failed");
//     return;
//   }
//   res.status(200).send("update succeeded");
// });

// router.get("/checkvalid", async (req, res) => {
//   const { teamname } = req.query;
//   const team = await findAndCheckValid(teamname);
//   res.status(200).send(team);
// });

// Login
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);
  const user = await User.findAndValidate(username, password);
  if (!user) {
    res.status(200).send({ username: "" });
    console.log("login failed");
    return;
  }
  res.status(200).send({ username: user.username });
  // null, npc, admin: String
});

router.get("/room", async (req, res) => {
  res.status(200).send(req.io.room);
});

router.post("/loan", async (req, res) => {
  const { id, loan } = req.body;
  const team = await Team.find({ id: id });
  team[0].money += loan;
  team[0].loan += loan;
  await team[0].save();
  res.json("Success").status(200);
});

// router.post("/logout", async (req, res) => {
//   req.session.destroy();
//   res.status(200).send("logout success");
// });

// router.get("/adminsecret", requireAdmin, async (req, res) => {
//   res.status(200).send("admin secret");
// });

// router.get("/npcsecret", requireNPC, async (req, res) => {
//   res.status(200).send("npc secret");
// });

router.post("/transferLand", async (req, res) => {
  const { buyerTeamId, sellerTeamId, landId, amount } = req.body;

  try {
    // Fetch the land
    const land = await Land.findOne({ id: landId });
    if (!land) {
      return res.status(404).send("Land not found");
    }

    // Verify seller owns the land
    if (land.owner !== sellerTeamId) {
      return res.status(403).send("Seller does not own this land");
    }

    // Fetch buyer and seller teams
    const buyerTeam = await Team.findOne({ id: buyerTeamId });
    const sellerTeam = await Team.findOne({ id: sellerTeamId });

    if (!buyerTeam || !sellerTeam) {
      return res.status(404).send("Team not found");
    }

    // Check if buyer has enough money
    if (buyerTeam.money < amount) {
      return res.status(403).send("Buyer does not have enough money");
    }

    // Transfer money and ownership
    buyerTeam.money -= amount;
    sellerTeam.money += amount;
    land.owner = buyerTeamId;
    // Level stays the same (no modification needed)
    buyerTeam.propertyValue += amount/4;
    sellerTeam.propertyValue -= amount/4;

    // Save changes
    await buyerTeam.save();
    await sellerTeam.save();
    await land.save();

    res.status(200).json({
      message: "Land transfer successful",
      land: land,
      buyerTeam: buyerTeam,
      sellerTeam: sellerTeam,
    });
  } catch (error) {
    console.error("Land transfer error:", error);
    res.status(500).send("Internal server error");
  }
});

export default router;
