import { generate } from "raidmaker";

export const pinCreates = async (req, res) => {
  try {
    const pins = generate(8, { no: 6, mode: "figs" });

    if (!pins || pins.length === 0) {
      return res.status(400).json({ message: "Failed to generate pins" });
    }

    res.status(200).json({
      message: "Pins generated",
      pins
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};