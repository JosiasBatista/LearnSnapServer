import { User } from '@prisma/client';
import prisma from '.';

export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  return prisma.user.create({
    data: userData,
  });
};

export const updateUser = async (userData: Omit<User, "password"|"areasOfInterest">) => {
  console.log(userData)
  return prisma.user.update({
    omit: {
      password: true
    },
    where: { id: userData.id },
    data: {
      mainAreaId: userData.mainAreaId,
      name: userData.name,
      email: userData.email
    },
    include: {
      areasOfInterest: {
        include: {
          area: true
        }
      },
      mainArea: true
    }
  })
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    omit: {
      password: true
    },
    where: { id },
    include: {
      areasOfInterest: {
        include: {
          area: true
        }
      },
      mainArea: true
    }
  });
}

export const findAreasOfInterest = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      areasOfInterest: true
    }
  })
}

export const addAreasOfInterest = async (areas: { userId: number, areaId: number }[]) => {
  return prisma.areasOfInterest.createMany({
    data: areas
  })
}

export const removeAreasOfInterest = async (areas: { userId: number, areaId: number }[]) => {
  const areasId = areas.map(area => area.areaId);
  const userId = areas[0]?.userId;

  return prisma.areasOfInterest.deleteMany({
    where: {
      areaId: {
        in: areasId
      },
      AND: {
        userId: userId
      }
    }
  })
}