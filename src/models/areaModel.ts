import { Area } from "@prisma/client";
import prisma from ".";

export const getAreas = async () => {
  const areas = await prisma.area.findMany();

  return areas;
}

export const getAreaByName = async (name: string) => {
  return await prisma.area.findFirst({
    where: {
      description: name
    }
  })
}

export const createArea = async (areaData: Omit<Area, "id">) => {
  return await prisma.area.create({
    data: areaData
  })
}