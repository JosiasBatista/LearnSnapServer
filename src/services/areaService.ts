import { Area } from "@prisma/client";
import * as areaModel from "../models/areaModel";

export const getAreas = async () => {
  return await areaModel.getAreas();
}

export const getAreaByNameOrCreate = async (name: string) => {
  const area = await areaModel.getAreaByName(name);

  if (area) return area;

  const areaData: Omit<Area, "id"> = {
    description: name
  };
  return areaModel.createArea(areaData);
}

export const getAreasInNameArray = async (names: string[]) => {
  const areas = await areaModel.getAreasInNameArray(names);
  return areas;
}