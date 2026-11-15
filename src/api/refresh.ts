import type { Request, Response } from 'express';
import { getBearerToken, makeJWT } from '../auth.js';
import { config } from '../config.js';
import { UnauthorizedError } from '../errors.js';
import { userForRefreshToken } from '../db/queries/refreshTokens.js';

export async function handlerRefresh(req: Request, res: Response) {
    let token: string;

    try {
        token = getBearerToken(req);
    } catch {
        throw new UnauthorizedError("Invalid or missing refresh token");
    }

    const user = await userForRefreshToken(token);
    
    if (!user) {
        throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const accessToken = makeJWT(user.id, 60 * 60, config.jwtSecret);

    return res.status(200).json({ token: accessToken });
}

