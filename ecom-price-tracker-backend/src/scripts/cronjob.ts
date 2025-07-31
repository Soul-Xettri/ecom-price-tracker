import cron from "node-cron";
import { User } from "../models/User";
import { checkProductPrices } from "../services/alert-checker";
import pLimit from "p-limit";

let isRunning = false;

const cronJob = cron.schedule("0 0 * * *", async () => {
  if (isRunning) {
    console.warn("⏳ Previous cron job still running. Skipping new run.");
    return;
  }

  isRunning = true;
  console.log("🔁 Cronjob running:", new Date().toISOString());

  try {
    const users = await User.find();
    if (!users.length) {
      console.log("No users found for cron job.");
      return;
    }

    const limit = pLimit(3);
    const userChecks = users.map((user) =>
      limit(() => checkProductPrices(user._id.toString()))
    );

    await Promise.all(userChecks);
  } catch (err) {
    console.error("❌ Error during cron job:", err);
  } finally {
    isRunning = false;
    console.log("✅ Cronjob completed:", new Date().toISOString());
  }
});

export default cronJob;
