import { Area } from "@prisma/client";
import prisma from ".";

export const getAreas = async () => {
  const areas = await prisma.area.findMany();

  return areas;
}

export const getAreaByName = async (description: string) => {
  return await prisma.area.findFirst({
    where: {
      description: description
    }
  })
}

export const getAreasInNameArray = async (descriptions: string[]) => {
  return await prisma.area.findMany({
    where: {
      description: {
        in: descriptions
      }
    }
  })
}

export const createArea = async (areaData: Omit<Area, "id">) => {
  return await prisma.area.create({
    data: areaData
  })
}