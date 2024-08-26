import jwt from "jsonwebtoken";

import { User } from "@prisma/client";

export const generateAccessToken = (user: User) => {
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

    if (jwtAccessSecret) {
        return jwt.sign({ 
            userId: user.id,
            userType: user.type,
            userName: user.name
         }, jwtAccessSecret, {
            expiresIn: '5m'
        })
    } else {
        return null
    }
}

export const generateRefreshToken = (user: User, jti: string) => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (jwtRefreshSecret) {
        return jwt.sign({
            userId: user.id,
            jti
        }, jwtRefreshSecret, {
            expiresIn: '8h'
        })
    } else {
        return null;
    }
}

export const generateTokens = (user: User, jti: string) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken
    };
}