import { Sequelize } from "sequelize";
import Scores from "../model/Scores.js";
import Users from "../model/Users.js";

Users.hasMany(Scores, { foreignKey: "user_id" });
Scores.belongsTo(Users, { foreignKey: "user_id" });

// Add new score
export const newScore = async (req, res) => {
  const { userId, score } = req.body;
  try {
    if (!userId) throw error;
    console.log("id: ", userId);
    console.log("score: ", score);
    await Scores.create({ user_id: userId, score: score });
    res.json({ msg: "Score saved!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Invalid User ID", error: error });
  }
};

// Get high score of user_id
export const getUserHighScore = async (req, res) => {
  const { user_id } = req.query;
  console.log("user_id: ", user_id);
  try {
    const highscore = await Scores.max("score", {
      where: { user_id: user_id },
    });
    if (highscore) res.json({ highscore: highscore });
    else res.json({ highscore: null });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Invalid User ID" });
  }
};

// TODO: Get top 3 highest scores with their usernames
export const getHighestScores = async (req, res) => {
  try {
    const highscores = await Scores.findAll({
      attributes: [
        [Sequelize.fn("MAX", Sequelize.col("score")), "highscore"],
        "user.username",
      ],
      include: { model: Users },
      group: ["scores.user_id", "user.user_id"],
      order: [["highscore", "DESC"]],
      limit: 3,
    });
    let response = [];
    highscores.forEach((score) => {
      response.push({
        highscore: score.dataValues.highscore,
        username: score.user.username,
      });
    });
    if (!response) res.status(500).json({ msg: "something went wrong" });
    res.json({ highscores: response });
  } catch (error) {
    res.status(400).json({ msg: "bad request" });
  }
};

// Delete scores by User ID
export const deleteUserScores = async (req, res) => {};
