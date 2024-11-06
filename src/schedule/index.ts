import schedule from 'node-schedule';

import * as scrapperService from "../services/scrapperService";

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 5)];
rule.hour = 17;
rule.minute = 0;

const contentByDay = [
  "Business",
  "Productivity",
  "Programming",
  "Economics",
  "Marketing"
]

export default schedule.scheduleJob(rule, () => {
  const currentDay = new Date().getDay();
  scrapperService.runRobotTask("5be6a55d-2dad-4d3b-97f4-8003dd10c1ae", 
    {
      "search_text": contentByDay[currentDay],
      "max_posts": 3
    },
  );
})