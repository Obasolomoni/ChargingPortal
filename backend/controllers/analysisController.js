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

    const matchStage = {
      session: {
        $in: ["Charging", "Pending", "Collected"],
      },
    };

    // Only add search conditions when a search value exists
    if (search) {
      matchStage.$or = [
        { mobileName: { $regex: search, $options: "i" } },
        { personName: { $regex: search, $options: "i" } },
        { userNumber: { $regex: search, $options: "i" } },
        { sessionPins: { $regex: search, $options: "i" } },

        // Add these if they exist in your schema
        { sessionId: { $regex: search, $options: "i" } },
        { deviceId: { $regex: search, $options: "i" } },
      ];
    }

    const sessions = await charge.aggregate([
      // Filter charging sessions
      {
        $match: matchStage,
      },

      // Return only what the admin needs
      {
        $project: {
          _id: 1,
          mobileName: 1,
          session: 1,
          sessionId: 1,
          deviceId: 1,
          Registrar: 1,
          createdAt: 1,
        },
      },

      // Newest first
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error getting charging stats:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
