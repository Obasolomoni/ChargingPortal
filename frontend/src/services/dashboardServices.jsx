import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API =
  "https://chargingportal.onrender.com/api/dashboard/stats";

export async function getDashboardStats() {
  const res = await fetch(API);
  if(!res.ok){
    toast.error("Data not fetched from API")
  }

  return res.json();
};


const searchApi =
  "https://chargingportal.onrender.com/api/dashboard/chargeStats";

export async function getChargingStats(search = "") {
  const url = search
    ? `${searchApi}?search=${encodeURIComponent(search)}`
    : searchApi;

  const res = await fetch(url);

  if (!res.ok) {
    toast.error("Data not Found");
  }

  return res.json();
}
