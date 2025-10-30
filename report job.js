import cron from "node-cron";
import fs from "fs";
import { Parser } from "json2csv";

cron.schedule("0 0 * * *", async () => {
  const stats = {
    timestamp: new Date().toISOString(),
    apiCalls: 150,
    messages: 25,
    webhooks: 5
  };

  const csv = new Parser().parse([stats]);
  fs.writeFileSync(`./reports/report_${Date.now()}.csv`, csv);
  console.log("Daily report generated");
});
