import { User } from '@prisma/client';
import { prisma } from '.';

export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  return await prisma.user.create({
    data: userData,
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
}