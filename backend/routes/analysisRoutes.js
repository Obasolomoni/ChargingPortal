import { getDashboardStats } from "../controllers/analysisController.js";

const router = express.Router();
router.get("/dashboard", getDashboardStats);

export default router;