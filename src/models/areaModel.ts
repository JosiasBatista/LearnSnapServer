import prisma from ".";

export const getAreas = async () => {
  const areas = await prisma.area.findMany();

  return areas;
}