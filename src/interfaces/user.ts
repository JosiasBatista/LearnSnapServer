import { UserType } from '@prisma/client';

export interface UserResponse {
  id: number,
  name: string,
  email: string,
  createdAt: string
}

export interface Educator extends UserResponse {
  contentsPosted: number,
  field: string
}

export interface Learner extends UserResponse {
  areasOfInterests: string[]
}

export interface LoginReq {
  email: string,
  password: string
}

export interface RegisterReq {
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
  type: UserType
}