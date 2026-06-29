import * as raidmaker from "raidmaker";

const generator = raidmaker.default.default;

const pin = generator.generate(6, {
  mode: "figs",
  no: 1,
});

console.log(pin);