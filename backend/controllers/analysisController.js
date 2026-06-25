import charge from "../models/chargeModels.js";

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await charge.aggregate([
      {
        $group: {
          _id: null,

          totalSessions: {
            $sum: 1
          },

          chargingCount: {
            $sum: {
              $cond: [
                { $eq: ["$session", "Charging"] },
                1,
                0
              ]
            }
          },

          pendingCount: {
            $sum: {
              $cond: [
                { $eq: ["$session", "Pending"] },
                1,
                0
              ]
            }
          },

          collectedCount: {
            $sum: {
              $cond: [
                { $eq: ["$session", "Collected"] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      totalSessions: 0,
      chargingCount: 0,
      pendingCount: 0,
      collectedCount: 0
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const chargingStats = async (req, res) => {
    try {

        const sessions = await charge.aggregate([
            {
                $match: {
                    session: "Charging"
                }
            }
        ]);

        res.json(sessions);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};