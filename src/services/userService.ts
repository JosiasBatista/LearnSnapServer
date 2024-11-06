import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import * as userModel from '../models/userModel';
import { RegisterReq } from '../interfaces/user';
import { CustomError } from '../exceptions/CustomError';
import { JwtPayload } from 'jsonwebtoken';
import * as areaService from './areaService';

export const createUser = async (userReq: RegisterReq): Promise<User> => {
  const existingUser = await userModel.findUserByEmail(userReq.email);

  console.log(existingUser)
  if (existingUser) {
    throw new Error('Email já em uso');
  }

  const { passwordConfirm, ...userInfos } = userReq;

  return bcrypt.hash(userInfos.password, 10).then(async (hash) => {
    const userData: Omit<User, "id"> = {
      ...userInfos,
      contentsPosted: 0,
      createdAt: new Date(),
      field: "",
      password: hash,
      mainAreaId: null
    }
  
    const user = await userModel.createUser(userData);
    return user;
  }).catch(() => {
    throw new CustomError("Erro ao criar usuário", 500);
  })
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return userModel.findUserByEmail(email);
}

export const findUserById = async (id: number) => {
  return userModel.findUserById(id);
}

export const getUserAreasOfInterest = async (id: number) => {
  return userModel.findAreasOfInterest(id);
}

const updateAreasOfInterest = async (user: any, namesOfAreasOfInterest: string[]) => {
  const currentUserAreasOfInterest = user.areasOfInterest.map((area: { areaId: any; }) => area.areaId);

  const areasOfInterest = await areaService.getAreasInNameArray(namesOfAreasOfInterest);
  const idsOfAreasOfInterest = areasOfInterest.map(area => area.id);

  const toRemove = currentUserAreasOfInterest.filter((x: number) => !idsOfAreasOfInterest.includes(x));
  const toAdd = idsOfAreasOfInterest.filter(x => !currentUserAreasOfInterest.includes(x));

  console.log("AREAS OF INTERES: ", areasOfInterest)
  console.log("AREAS OF INTERES, TO ADD: ", toAdd)
  userModel.addAreasOfInterest(toAdd.map(areaId => ({ areaId: areaId, userId: user.id})));
  userModel.removeAreasOfInterest(toRemove.map((areaId: any) => ({ areaId: areaId, userId: user.id})))
}

export const updateUserAreas = async (request: { mainArea?: string, areasOfInterest?: string[]}, 
  payload: JwtPayload) => {
  const user = await findUserById(payload.userId);

  if (!user) {
    throw new CustomError("Usuário não encontrado", 400);
  }
  
  if (request.areasOfInterest && request.areasOfInterest.length > 0) {
    await updateAreasOfInterest(user, request.areasOfInterest);
  }
  
  if (request.mainArea) {
    const mainArea = await areaService.getAreaByNameOrCreate(request.mainArea);
    
    if (mainArea) {
      user.mainAreaId = mainArea.id;
      return await userModel.updateUser(user);
    }
  } else {
    return await findUserById(payload.userId);
  }
}