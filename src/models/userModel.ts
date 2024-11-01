import { User } from '@prisma/client';
import prisma from '.';

export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  return prisma.user.create({
    data: userData,
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      areasOfInterest: true,
    }
  });
}