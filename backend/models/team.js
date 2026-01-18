import mongoose from "mongoose";
const Schema = mongoose.Schema;
const TeamSchema = new Schema({
  id: Number,
  teamname: String,
  money: Number,
  loan: Number,
  propertyValue: Number,
});

TeamSchema.statics.findAndCheckValid = async function (id) {
  const team = await this.findOne({ id: id });
  if (!team) {
    return null;
  }
  await team.save();
  return team;
};

const Team = mongoose.model("Team", TeamSchema);
export default Team;
