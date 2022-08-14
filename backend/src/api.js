import express from "express";
import Team from "../models/team.js";
import Land from "../models/land.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import Event from "../models/event.js";
import Pair from "../models/pair.js";
import Effect from "../models/effect.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ a: 1, b: 2 });
});

// const requireAdmin = (req, res, next) => {
//   if (!req.session.user) {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }
//   if (req.session.user.username !== "admin") {
//     res.status(403).json({ error: "Forbidden" });
//     return;
//   }
//   next();
// };

// const requireNPC = (req, res, next) => {
//   if (!req.session.user) {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }
//   next();
// };

async function calcmoney(teamname, money, estate) {
  const team = await Team.findOne({ teamname });
  if (money > 0) {
    if (team.soulgem.value) {
      money *= 2;
    }
    if (estate) {
      money *= team.bonus.value;
    }
  } else {
    if (team.soulgem.value) {
      money *= 1.5;
    }
  }
  return money;
}

async function deleteTimeoutNotification() {
  // delete timeout notifications
  const notifications = await Notification.find();
  const time = Date.now() / 1000;
  // console.log(notifications);
  for (let i = 0; i < notifications.length; i++) {
    // console.log(notifications[i]);
    if (
      notifications[i].createdAt + notifications[i].duration < time &&
      notifications[i].duration > 0
    ) {
      await Notification.findByIdAndDelete(notifications[i]._id);
      // console.log("Deleted notification", notifications[i].id);
    }
  }
}

router.get("/phase", async (req, res) => {
  const phase = await Pair.findOne({ key: "phase" });
  res.json({ phase: phase.value }).status(200);
});

router.get("/team", async (req, res) => {
  const teams = await Team.find().sort({ teamname: 1 });
  res.json(teams).status(200);
});

router.get("/team/:teamId", async (req, res) => {
  const team = await Team.findOne({ teamId: req.params.teamId });
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

router.get("/allEvents", async (req, res) => {
  const events = await Event.find().sort({ id: 1 });
  res.json(events).status(200);
});

router
  .post("/event", async (req, res) => {
    const { id } = req.body;
    const pair = await Pair.findOneAndUpdate(
      { key: "currentEvent" },
      { value: id }
    );
    if (pair) {
      res.json({ success: true }).status(200);
    } else {
      res.json({ success: false }).status(403);
    }
  })
  .get("/event", async (req, res) => {
    const pair = await Pair.findOne({ key: "currentEvent" });
    const event = await Event.findOne({ id: pair.value });
    res.json(event).status(200);
  });

router.post("/occupation", async (req, res) => {
  const { teamname, occupation } = req.body;
  const team = await Team.findOne({ teamname });
  team.occupation = occupation;
  await team.save();

  if (occupation === "鷹眼") {
    const pair = await Pair.findOneAndUpdate(
      { key: "hawkEyeTeam" },
      { value: team.id }
    );
  }
  res.json(team).status(200);
});

router.post("/level", async (req, res) => {
  const { teamId, level } = req.body;
  const team = await Team.findOneAndUpdate({ id: teamId }, { level: level });
  console.log(team);
  res.json(team).status(200);
});

router.post("/add", async (req, res) => {
  const { id, teamname, dollar } = req.body;
  const team = await Team.findAndCheckValid(id);
  if (!team) {
    res.status(403).send();
    console.log("Team not found");
    return;
  }
  if (team.soulgem.value === true) {
    if (dollar < 0) {
      const newTeam = await Team.findOneAndUpdate(
        { id: id },
        { money: Math.round(team.money + dollar * 1.5) }
      );
      if (!newTeam) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    } else {
      const newTeam = await Team.findOneAndUpdate(
        { id: id },
        { money: team.money + dollar * 2 }
      );
      if (!newTeam) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    }
  } else {
    const newTeam = await Team.findOneAndUpdate(
      { id: id },
      { money: team.money + dollar }
    );
    console.log(team, newTeam);
    if (!newTeam) {
      res.status(403).send();
      console.log("Update failed");
      return;
    }
  }
  res.status(200).send("Update succeeded");
});

router.post("/transfer", async (req, res) => {
  const { from, to, IsEstate, dollar, equal } = req.body;
  const team1 = await Team.findAndCheckValid(from);
  if (!team1) {
    res.status(403).send();
    console.log("Team not found");
    return;
  }
  const team2 = await Team.findOne({ id: to });
  if (!team2) {
    res.status(403).send();
    console.log("Team not found");
    return;
  }
  if (equal) {
    const equalmoney = Math.round((team1.money + team2.money) / 2);
    const newTeam1 = await Team.findOneAndUpdate(
      { id: from },
      { money: equalmoney }
    );
    const newTeam2 = await Team.findOneAndUpdate(
      { id: to },
      { money: equalmoney }
    );
    if (!newTeam1 || !newTeam2) {
      res.status(403).send();
      console.log("Update failed");
      return;
    }
    res.status(200).send("Update succeeded");
    return;
  }

  if (!IsEstate) {
    if (team1.soulgem.value === true) {
      const newTeam1 = await Team.findOneAndUpdate(
        { id: from },
        { money: Math.round(team1.money - dollar * 1.5) }
      );
      if (!newTeam1) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    } else {
      const newTeam1 = await Team.findOneAndUpdate(
        { id: from },
        { money: team1.money - dollar }
      );
      if (!newTeam1) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    }
    if (team2.soulgem.value === true) {
      const newTeam2 = await Team.findOneAndUpdate(
        { id: to },
        { money: team2.money + dollar * 2 }
      );
      if (!newTeam2) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    } else {
      const newTeam2 = await Team.findOneAndUpdate(
        { id: to },
        { money: team2.money + dollar }
      );
      if (!newTeam2) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    }
  } else {
    if (team1.soulgem.value === true) {
      const newTeam1 = await Team.findOneAndUpdate(
        { id: from },
        { money: Math.round(team1.money - dollar * 1.5 * team2.bonus.value) }
      );
      if (!newTeam1) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    } else {
      const newTeam1 = await Team.findOneAndUpdate(
        { id: from },
        { money: team1.money - dollar * team2.bonus.value }
      );
      if (!newTeam1) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    }
    if (team2.soulgem.value === true) {
      const newTeam2 = await Team.findOneAndUpdate(
        { id: to },
        { money: team2.money + dollar * 2 * team2.bonus.value }
      );
      if (!newTeam2) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    } else {
      const newTeam2 = await Team.findOneAndUpdate(
        { id: to },
        { money: team2.money + dollar * team2.bonus.value }
      );
      if (!newTeam2) {
        res.status(403).send();
        console.log("Update failed");
        return;
      }
    }
  }
  res.status(200).send("Update succeeded");
});

async function updateHawkEye(land) {
  const { value: hawkEyeTeam } = await Pair.findOne({ key: "hawkEyeTeam" });
  if (hawkEyeTeam === 0) return;
  const hawkEyeBuildings = await Land.find({ owner: hawkEyeTeam });
  console.log(hawkEyeBuildings);
  for (let i = 0; i < hawkEyeBuildings.length; i++) {
    await Land.findOneAndUpdate(
      { id: hawkEyeBuildings[i].id - 1 },
      { hawkEye: 1 }
    );
    await Land.findOneAndUpdate(
      { id: hawkEyeBuildings[i].id + 1 },
      { hawkEye: 1 }
    );
  }
  for (let i = 0; i < hawkEyeBuildings.length; i++) {
    await Land.findOneAndUpdate({ id: hawkEyeBuildings[i].id }, { hawkEye: 2 });
  }
  console.log("hawkEye updated");
}

router.post("/ownership", async (req, res) => {
  const { teamId, land, level } = req.body;
  const tmp1 = await Land.findOneAndUpdate({ name: land }, { owner: teamId });
  if (!tmp1) {
    res.status(403).send();
    console.log("Update failed");
    return;
  }
  const tmp2 = await Land.findOneAndUpdate({ name: land }, { level: level });
  if (!tmp2) {
    res.status(403).send();
    console.log("Update failed");
    return;
  }
  await updateHawkEye(land);
  res.status(200).send("update succeeded");
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
    description,
    duration,
    createdAt: time,
  };
  // await deleteTimeoutNotification();
  // save
  await new Notification(notification).save();
  await team.save();
  res.status(200).send("Update succeeded");
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
    res.status(200).send(null);
    console.log("login failed");
    return;
  }
  // req.session.user = user;
  res.status(200).send({ username: user.username });
  // null, npc, admin: String
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

export default router;
