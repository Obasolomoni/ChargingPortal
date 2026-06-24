
export const nowLagos = () => {
  return {
    time: new Date().toLocaleTimeString("en-NG", { timeZone: "Africa/Lagos" }),
    date: new Date().toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" }),
  };
};