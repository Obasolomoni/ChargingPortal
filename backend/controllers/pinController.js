// const { generate } = require('raidmaker');
// import charge from "../models/pinsModels.js";

// export const pinCreates = async (req, res) => {
//     const pins = generate(8, { no: 6, mode: 'figs' });
//     try {
//         const { pins } = req.body
//         if (!pins) {
//             res.status(400).json({ message: "Pin needed" })
//         } else {
//             res.status(201).json({ message: "Pin Successful" })
//         }
//     } catch (errror) {
//         res.status(500).json({ message: err.message })
//     }
// }