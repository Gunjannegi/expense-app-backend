
import User from "../models/user.js";

export const getLeaderboardData = async (req, res) => {
  try {

    const leaderboard = await User.findAll({
      attributes: [
        'id',
        'username',
        'totalExpense'
      ],
      order: [['totalExpense', 'DESC']]
    });

    if (leaderboard.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No data found"
      });
    }

    res.status(200).json({
      success: true,
      data: leaderboard,
      message: "Data is successfully fetched"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
