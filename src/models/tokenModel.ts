import prisma from ".";
import { RefreshTokenProps } from "../interfaces/token";
import { hashToken } from "../utils/hashToken";

export const createRefreshToken = ({ jti, refreshToken, userId}: RefreshTokenProps) => {
    return prisma.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId
        }
    });
}

export const findTokenById = (id: string) => {
    return prisma.refreshToken.findUnique({
        where: { id }
    })
}

export const deleteTokenById = (id: string) => {
    return prisma.refreshToken.update({
        where: { id },
        data: {
            revoked: true
        }
    })
}

export const revokeAllUserTokens = (userId: number) => {
    return prisma.refreshToken.updateMany({
        where: { userId },
        data: { 
            revoked: true 
        }
    })
}