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

export const getchargingStats = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";

    const sessions = await charge.aggregate([
      // Only track session records
      {
        $match: {
          session: {
            $in: ["Charging", "Pending", "Collected"]
          }
        }
      },

      // Search within those session records
      {
        $match: {
          $or: [
            { mobileName: { $regex: search, $options: "i" } },
            { personName: { $regex: search, $options: "i" } },
            { userNumber: { $regex: search, $options: "i" } },
            { sessionPins: { $regex: search, $options: "i" } }
          ]
        }
      },

      // Return only what the admin needs
      {
        $project: {
          _id: 1,
          mobileName: 1,
          session: 1,
          Registrar: 1,
          createdAt: 1
        }
      },

      // Newest first
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);

    res.status(200).json(sessions);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};