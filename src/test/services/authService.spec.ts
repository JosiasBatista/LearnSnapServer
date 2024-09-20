import { User } from "@prisma/client";
import bcrypt from "bcrypt";

import { CustomError } from "../../exceptions/CustomError";
import { LoginReq } from "../../interfaces/user";
import * as tokenModel from "../../models/tokenModel";
import * as jwt from "../../utils/jwt";
import * as authService from "../../services/authService";
import * as userService from "../../services/userService";
import assert from "assert";

jest.mock("bcrypt");
jest.mock("../../services/userService");
jest.mock("../../models/tokenModel");
jest.mock("../../utils/jwt", () => ({
  generateTokens: jest.fn(),
}));

describe('Testing auth service', () => {
  afterEach(() => {
    jest.resetModules() 
  });  
  
  test('Should throw error when auth request has error', async () => {
    const requestBody: LoginReq = {
      email: "user@gmail.com",
      password: ""
    }
  
    try {
      await authService.authenticateUser(requestBody);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      
      if (error instanceof CustomError) {
        expect(error.message).toBe("Informações incompletas");
        expect(error.getStatusCode()).toBe(400);
      }
    }
  })
  
  test('Should throw error when user not found', async () => {
    const requestBody: LoginReq = {
      email: "user@gmail.com",
      password: "senhasegura"
    };
  
    (userService.findUserByEmail as jest.Mock).mockResolvedValue(null);
  
    try {
      await authService.authenticateUser(requestBody);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      
      if (error instanceof CustomError) {
        expect(error.message).toBe("Usuário não existente na base");
        expect(error.getStatusCode()).toBe(400);
      }
    }
  })
  
  test('Should throw error when password does not match', async () => {
    const requestBody: LoginReq = {
      email: "cooluser@gmail.com",
      password: "senhasegura"
    };
    const user: User = {
      id: 1,
      name: "Cool User",
      email: "cooluser@gmail.com",
      password: "senhasegura",
      type: "Learner",
      field: "senhasegura",
      contentsPosted: 0,
      createdAt: new Date()
    };
  
    (userService.findUserByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  
    try {
      await authService.authenticateUser(requestBody);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      
      if (error instanceof CustomError) {
        expect(error.message).toBe("Informações de login inválidas");
        expect(error.getStatusCode()).toBe(400);
      }
    }
  })
  
  test('Should throw error when token generation fail', async () => {
    const requestBody: LoginReq = {
      email: "cooluser@gmail.com",
      password: "senhasegura"
    };
    const user: User = {
      id: 1,
      name: "Cool User",
      email: "cooluser@gmail.com",
      password: "senhasegura",
      type: "Learner",
      field: "senhasegura",
      contentsPosted: 0,
      createdAt: new Date()
    };
  
    (userService.findUserByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.generateTokens as jest.Mock).mockResolvedValue({
      accessToken: "",
      refreshToken: ""
    })
  
    try {
      await authService.authenticateUser(requestBody);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      
      if (error instanceof CustomError) {
        expect(error.message).toBe("Erro ao realizar autenticação");
        expect(error.getStatusCode()).toBe(500);
      }
    }
  })
  
  test('Should authenticate user when everything is correct', async () => {
    const requestBody: LoginReq = {
      email: "cooluser@gmail.com",
      password: "senhasegura"
    };
    const user: User = {
      id: 1,
      name: "Cool User",
      email: "cooluser@gmail.com",
      password: "senhasegura",
      type: "Learner",
      field: "senhasegura",
      contentsPosted: 0,
      createdAt: new Date()
    };
  
    (userService.findUserByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.generateTokens as jest.Mock).mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh"
    });
    (tokenModel.createRefreshToken as jest.Mock).mockResolvedValue(true);
  
    try {
      const response = await authService.authenticateUser(requestBody);
      
      expect(response.accessToken).not.toBeNull();
    } catch (error) {
      console.log(error)
      assert(false);
    }
  })
})