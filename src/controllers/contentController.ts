import { Request, Response } from "express";
import * as contentService from "../services/contentService";

export const getContentList = async (req: Request, res: Response) => {
  try {
    const contents = await contentService.getContents(
      parseInt(req.params.page), 
      parseInt(req.params.limit)
    );

    res.status(200).json(contents);
  } catch {
    throw new Error();
  }
}