import { Request, Response } from 'express';
import { getUserByEmail } from '../db/queries/users.js';
import { checkPasswordHash } from '../auth.js';
import { users } from '../db/schema.js';
import { makeJWT, makeRefreshToken } from '../auth.js';
import { config } from '../config.js';
import { createRefreshToken } from '../db/queries/refreshTokens.js';

type UserResponse = Omit<typeof users.$inferSelect, "hashedPassword">;

export async function handlerLogin(req: Request, res: Response) {
    const { email, password } = req.body ?? {};

    const expiresInSeconds = Math.min(req.body.expiresInSeconds ?? 3600, 3600,);

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(401).json({
            error: "Invalid email or password",
        });
    }
    
    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        const passwordMatches = await checkPasswordHash(password, user.hashedPassword);

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        const token = makeJWT(user.id, 60 * 60, config.jwtSecret);
        const refreshToken = makeRefreshToken();;

        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

        await createRefreshToken(refreshToken, user.id, expiresAt);

        const userResponse: UserResponse = {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            isChirpyRed: user.isChirpyRed,
        };

        return res.status(200).json({ ...userResponse, token, refreshToken });
    } catch {
        return res.status(401).json({
            error: 'Incorrect email or password',
        });
    }
}

