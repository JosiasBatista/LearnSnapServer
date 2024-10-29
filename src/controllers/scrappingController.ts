import { Request, Response } from 'express';
import * as scrapperService from '../services/scrapperService';

export const runRobotTask = async (req: Request, res: Response) => {
  const response: any = await scrapperService.runRobotTask(req.body.robotId, req.body.inputParameters);

  res.status(200).json(response);
}

export const robotTaskFinished = async (req: Request, res: Response) => {
  await scrapperService.getRobotTask(req.body.task.robotId, req.body.task.id);

  res.status(200).json({ "status": "success" });
}