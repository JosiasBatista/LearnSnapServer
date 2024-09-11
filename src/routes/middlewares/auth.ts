import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../../interfaces/commons";

export const isAuthenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error('🚫 Un-Authorized 🚫');
  }

  console.log("AUTH MIDDLEWARE || Token encontrado com sucesso")
  try {
    const token = authorization.split(' ')[1];
    if (!process.env.JWT_ACCESS_SECRET) {
      res.status(500);
      throw new Error('Erro ao buscar accessSecret');
    }
    console.log("AUTH MIDDLEWARE || AccessSecret encontrado com sucesso")
    
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    console.log("AUTH MIDDLEWARE || Token validado com sucesso")
    req.payload = payload;
  } catch (err) {
    res.status(401);

    throw new Error('🚫 Un-Authorized 🚫');
  }

  return next();
}

export const isAuthenticatedAsEducator = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error('🚫 Un-Authorized 🚫');
  }

  console.log("AUTH MIDDLEWARE || Token encontrado com sucesso")
  try {
    const token = authorization.split(' ')[1];
    if (!process.env.JWT_ACCESS_SECRET) {
      res.status(500);
      throw new Error('Erro ao buscar accessSecret');
    }
    console.log("AUTH MIDDLEWARE || AccessSecret encontrado com sucesso")
    
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (typeof payload !== "string" && payload.userType !== "Educator") {
      res.status(401);
      throw new Error('🚫 Must be an Educator to access 🚫')
    }

    console.log("AUTH MIDDLEWARE || Token validado com sucesso")
    req.payload = payload;
  } catch (err) {
    res.status(401);

    throw new Error('🚫 Un-Authorized 🚫');
  }

  return next();
}